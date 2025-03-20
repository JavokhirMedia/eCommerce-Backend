import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'src/config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: config.EMAIL,
                        pass: config.EMAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: `"No Reply" <${configService.get<string>('EMAIL')}>`,
                },
            }),
        }),
    ],
    exports: [MailerModule],
})
export class MailModule { }
