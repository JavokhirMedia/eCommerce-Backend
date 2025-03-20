import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'page must be a number' })
    @Min(1, { message: 'page must be at least 1' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'limit must be a number' })
    @Min(1, { message: 'limit must be at least 1' })
    limit?: number = 10;
}
 