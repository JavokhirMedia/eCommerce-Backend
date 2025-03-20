import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { config } from "src/config";
import { RegisterDto } from "./dto/register.dto";
import { BcryptEncryption } from "src/infrastructure/bcrypt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { UserEntity } from "src/core/entity";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { CustomMailerService } from "src/infrastructure/mail/mail.service";
import { RedisCacheService } from "src/infrastructure/redis/redis.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisCacheService,
        private readonly customMailerService: CustomMailerService
    ) { }

    // // **1️⃣ Foydalanuvchini ro‘yxatdan o‘tkazish**
    // async register(registerDto: RegisterDto) {
    //     const { email, password, name } = registerDto;
    //     const existingUser = await this.userRepository.findOne({ where: { email } });

    //     if (existingUser) {
    //         throw new ConflictException("Email already registered.");
    //     }

    //     const hashedPassword = await BcryptEncryption.encrypt(password);
    //     const user = this.userRepository.create({ email, password: hashedPassword, name });
    //     await this.userRepository.save(user);

    //     return this.generateTokens(user.id, user.email, user.role);
    // }

    async sendOtp(email: string) {
        const existingUser = await this.userRepository.findOne({ where: { email } });

        if (existingUser) {
            throw new ConflictException("Email already registered.");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali OTP
        await this.redisService.set(`otp:${email}`, otp, 300); // 5 daqiqa amal qiladi

        await this.customMailerService.sendOtpEmail(email, otp);

        return { message: "OTP sent to email." };
    }

    // **2️⃣ OTP bilan ro‘yxatdan o‘tish**
    async registerWithOtp(registerDto: RegisterDto, otp: string) {
        const storedOtp = await this.redisService.get(`otp:${registerDto.email}`);
        if (!storedOtp || storedOtp !== otp) {
            throw new UnauthorizedException("Invalid or expired OTP.");
        }

        const hashedPassword = await BcryptEncryption.encrypt(registerDto.password);
        const user = this.userRepository.create({ ...registerDto, password: hashedPassword });
        await this.userRepository.save(user);

        await this.redisService.deleteByText(`otp:${registerDto.email}`);

        return this.generateTokens(user.id, user.email, user.role);
    }

    // **2️⃣ Login qilish**
    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        const isPasswordValid = await BcryptEncryption.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        return this.generateTokens(user.id, user.email, user.role);
    }

    // **3️⃣ Parolni yangilash**
    async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
        const { currentPassword, newPassword } = updatePasswordDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new UnauthorizedException("User not found.");
        }

        const isPasswordValid = await BcryptEncryption.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Current password is incorrect.");
        }

        user.password = await BcryptEncryption.encrypt(newPassword);
        await this.userRepository.save(user);

        return { message: "Password updated successfully." };
    }

    // **4️⃣ Parolni tiklash – Email yuborish**
    async forgotPassword(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException("User with this email not found.");
        }

        const resetToken = this.jwtService.sign(
            { id: user.id, email: user.email },
            { secret: config.ACCESS_TOKEN_SECRET_KEY, expiresIn: "15m" }
        );

        await this.redisService.set(`reset_token:${user.id}`, resetToken, 900);

        await this.customMailerService.sendPasswordResetEmail(user.email, resetToken);

        return { message: "Password reset link sent to email." };
    }

    // **5️⃣ Parolni tiklash – Yangi parol o‘rnatish**
    async resetPassword(token: string, newPassword: string) {
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: config.ACCESS_TOKEN_SECRET_KEY,
            });
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired token.");
        }

        const savedToken = await this.redisService.get(`reset_token:${payload.id}`);
        if (!savedToken || savedToken !== token) {
            throw new UnauthorizedException("Invalid or expired token.");
        }

        const user = await this.userRepository.findOne({ where: { id: payload.id } });
        if (!user) {
            throw new NotFoundException("User not found.");
        }

        user.password = await BcryptEncryption.encrypt(newPassword);
        await this.userRepository.save(user);

        await this.redisService.deleteByText(`reset_token:${payload.id}`);

        return { message: "Password has been reset successfully." };
    }

    // **6️⃣ Refresh token orqali yangi token olish**
    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: config.REFRESH_TOKEN_SECRET_KEY,
            });

            const savedToken = await this.redisService.get(`refresh_token:${payload.id}`);
            if (!savedToken || savedToken !== refreshToken) {
                throw new UnauthorizedException("Invalid refresh token.");
            }

            const user = await this.userRepository.findOne({ where: { id: payload.id } });
            if (!user) {
                throw new UnauthorizedException("User not found.");
            }

            const tokens = await this.generateTokens(user.id, user.email, user.role);

            await this.redisService.set(`refresh_token:${user.id}`, tokens.refreshToken, 604800); // 7 kun

            return tokens;
        } catch (error) {
            throw new UnauthorizedException("Invalid refresh token.");
        }
    }

    // **7️⃣ Access va refresh token yaratish**
    private async generateTokens(userId: string, email: string, role: string) {
        const payload = { id: userId, email, role };

        const accessToken = this.jwtService.sign(payload, {
            secret: config.ACCESS_TOKEN_SECRET_KEY,
            expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: config.REFRESH_TOKEN_SECRET_KEY,
            expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME,
        });

        await this.redisService.set(`refresh_token:${userId}`, refreshToken, 604800); // 7 kun

        return {
            accessToken,
            refreshToken,
        };
    }
}