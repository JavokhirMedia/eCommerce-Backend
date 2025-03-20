import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateBasketDto {
  @ApiProperty({
    description: 'Mahsulotning miqdori (kamida 1 bo‘lishi kerak)',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
