import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Yangi access token olish uchun refresh token',
  })
  @IsString({ message: 'Refresh token matn bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Refresh token bo‘sh bo‘lishi mumkin emas' })
  refreshToken: string;
}
