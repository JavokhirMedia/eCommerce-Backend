import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'Foydalanuvchi email manzili',
    })
    @IsEmail({}, { message: 'Email manzil noto‘g‘ri formatda' })
    @IsNotEmpty({ message: 'Email bo‘sh bo‘lishi mumkin emas' })
    email: string;

    @ApiProperty({
        example: 'StrongPassword123',
        description: 'Foydalanuvchi paroli',
    })
    @IsString({ message: 'Parol matn bo‘lishi kerak' })
    @MinLength(8, { message: 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak' })
    @MaxLength(32, { message: 'Parol maksimal 32 ta belgidan oshmasligi kerak' })
    @IsNotEmpty({ message: 'Parol bo‘sh bo‘lishi mumkin emas' })
    password: string;
}
