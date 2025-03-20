import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class UpdateBasketQuantityDto {
    @ApiProperty({ example: 2, description: "Updated quantity of the product" })
    @IsInt()
    @Min(1)
    quantity: number;
}
