import { IsOptional, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class GetProductsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @Type(() => Number)
    @IsInt({ message: 'page must be an integer number' })
    @Min(1, { message: 'page must not be less than 1' })
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @Type(() => Number)
    @IsInt({ message: 'limit must be an integer number' })
    @Min(1, { message: 'limit must not be less than 1' })
    limit?: number;

    @IsOptional()
    search?: string;
}
