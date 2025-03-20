import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { config } from "src/config";

@Injectable()
export class CustomMailerService {
    constructor(private readonly mailerService: MailerService) { }

    async sendPasswordResetEmail(email: string, resetToken: string) {
        const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await this.mailerService.sendMail({
            to: email,
            subject: "Password Reset Request",
            text: `Click the link to reset your password: ${resetLink}`,
        });

        return { message: "Password reset email sent successfully." };
    }

    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 100000 - 999999 oralig‘ida tasodifiy son
    }

    async sendOtpEmail(email: string, otpCode: string) {

        await this.mailerService.sendMail({
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otpCode}. It will expire in 5 minutes.`,
        });

        return { message: "OTP sent successfully.", otp: otpCode }; // OTP'ni qaytarish (agar saqlash kerak bo‘lsa)
    }
}
