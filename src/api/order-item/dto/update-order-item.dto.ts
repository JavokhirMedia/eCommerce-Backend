import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @ApiProperty({ example: 3, description: 'Updated quantity of the product', required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ example: 25.99, description: 'Updated price per unit', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}
