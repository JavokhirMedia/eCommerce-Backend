import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics', description: 'Category name' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({ example: 'c1e9b9e0-4f47-4eaa-93a7-9d9e0a2e6b3e', description: 'Parent category ID', required: false })
    @IsOptional()
    @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
    parentId?: string;
}
