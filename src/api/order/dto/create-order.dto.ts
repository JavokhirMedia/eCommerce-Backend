import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: '123 Main St', description: 'Order delivery address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '40.7128', description: 'Latitude' })
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty({ example: '-74.0060', description: 'Longitude' })
  @IsNotEmpty()
  @IsString()
  longitude: string;
}
