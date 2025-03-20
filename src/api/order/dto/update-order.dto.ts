import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'src/common/database/Enums';

export class UpdateOrderDto {
  @ApiProperty({ example: '123 Main St', description: 'Order delivery address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '40.7128', description: 'Latitude', required: false })
  @IsOptional()
  @IsString()
  latitude?: string;

  @ApiProperty({ example: '-74.0060', description: 'Longitude', required: false })
  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
