import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { FilterDto } from './dto/filter.dto';

export class QueryHelperService {
  static async paginateAndFilter<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
    filterDto?: FilterDto,
    searchFields?: string[]
  ) {
    const { page = 1, limit = 10 } = paginationDto;

    if (filterDto?.search && searchFields?.length) {
      queryBuilder.andWhere(
        searchFields
          .map(field => `${field} ILIKE :search`)
          .join(' OR '),
        { search: `%${filterDto.search}%` }
      );
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }
}
