import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBasketDto {
  @ApiProperty({
    description: 'Mahsulotning UUID shaklidagi IDsi',
    example: 'a3f0c999-4d44-4cfa-bbd4-4c9db0b6b9d6',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Mahsulotning miqdori (kamida 1 bo‘lishi kerak)',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
