import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Roles } from 'src/common/database/Enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ example: 'Updated Name', description: 'User first name', required: false })
    @IsOptional()
    @IsString({ message: 'First name must be a string' })
    name?: string;

    @ApiProperty({ example: 'UpdatedLastName', description: 'User last name', required: false })
    @IsOptional()
    @IsString({ message: 'Last name must be a string' })
    last_name?: string;

    @ApiProperty({ example: '1998-07-20', description: 'User birth date', required: false })
    @IsOptional()
    @IsString({ message: 'Birth date must be a string' })
    birth_date?: string;

    @ApiProperty({ example: 'newemail@example.com', description: 'User email', required: false })
    @IsOptional()
    @IsString({ message: 'Email must be a string' })
    email?: string;

    @ApiProperty({ example: '+998901234567', description: 'User phone number', required: false })
    @IsOptional()
    @IsString({ message: 'Phone number must be a string' })
    phone?: string;

    @ApiProperty({ example: 'NewPassword123!', description: 'User password', required: false })
    @IsOptional()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password?: string;

    @ApiProperty({ example: Roles.USER, description: 'User role', enum: Roles, required: false })
    @IsOptional()
    @IsEnum(Roles, { message: 'Invalid role' })
    role?: Roles;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'User avatar', required: false })
    @IsOptional()
    @IsString({ message: 'Avatar must be a string' })
    avatar?: string;
}
