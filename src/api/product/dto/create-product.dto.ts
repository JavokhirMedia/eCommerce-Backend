import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsUUID, IsArray, ArrayMinSize, Min, Max } from 'class-validator';
import { ProductStatus } from 'src/common/database/Enums';

export class CreateProductDto {
    @ApiProperty({ example: 'Smartphone', description: 'Product name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Latest model smartphone', description: 'Product description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 999, description: 'Product price' })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 50, description: 'Available stock quantity' })
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Min(0)
    stock: number;

    @ApiProperty({ example: 10, description: 'Product quantity' })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Min(1)
    quantity: number;

    @ApiPropertyOptional({
        example: ProductStatus.AVAILABLE,
        description: 'Product status',
        enum: ProductStatus
    })
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;

    @ApiPropertyOptional({ example: 'L', description: 'Product size' })
    @IsOptional()
    @IsString()
    size?: string;

    @ApiPropertyOptional({ example: ['#FF5733', '#33FF57'], description: 'Available colors in RGB or HEX format' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    color?: string[];

   

    @ApiPropertyOptional({ example: 4.5, description: 'Product rating' })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Min(0)
    @Max(5)
    rating?: number;

    @ApiProperty({ example: 'd3f9c2b1-1234-5678-abcd-9876543210ef', description: 'Category ID' })
    @IsNotEmpty()
    @IsUUID()
    categoryId: string;
}
