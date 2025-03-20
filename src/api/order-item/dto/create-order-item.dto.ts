import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
    @ApiProperty({ example: 'order-id-123', description: 'The ID of the order' })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ example: 'product-id-456', description: 'The ID of the product' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 2, description: 'The quantity of the product in the order' })
    @IsNumber()
    @Min(1)
    quantity: number;
}
