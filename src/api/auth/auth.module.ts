import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { config } from 'src/config';
import { BcryptEncryption } from 'src/infrastructure/bcrypt';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { CustomMailerService } from 'src/infrastructure/mail/mail.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME },
    }),
    RedisModule,
  ],
  providers: [AuthService, BcryptEncryption, CustomMailerService],
  controllers: [AuthController],
})
export class AuthModule { }
