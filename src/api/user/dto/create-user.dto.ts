import { ApiProperty } from '@nestjs/swagger';
import {
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';
import { Roles } from 'src/common/database/Enums';

export class CreateUserDto {
    @ApiProperty({ example: 'John', description: 'User first name' })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    name: string;

    @ApiProperty({ example: 'Doe', description: 'User last name', required: false })
    @IsOptional()
    @IsString({ message: 'Last name must be a string' })
    last_name?: string;

    @ApiProperty({ example: '1995-06-15', description: 'User birth date', required: false })
    @IsOptional()
    @IsString({ message: 'Birth date must be a string' })
    birth_date?: string;

    @ApiProperty({ example: 'john@example.com', description: 'User email' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: '+998901234567', description: 'User phone number' })
    @IsString({ message: 'Phone number must be a string' })
    @IsNotEmpty({ message: 'Phone number is required' })
    phone: string;

    @ApiProperty({ example: 'Password123!', description: 'User password' })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;

    @ApiProperty({ example: Roles.USER, description: 'User role', enum: Roles, default: Roles.USER })
    @IsOptional()
    @IsEnum(Roles, { message: 'Invalid role' })
    role?: Roles;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'User avatar', required: false })
    @IsOptional()
    @IsString({ message: 'Avatar must be a string' })
    avatar?: string;
}
