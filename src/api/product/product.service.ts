import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from 'src/core/entity/product.entity';
import { UserEntity } from 'src/core/entity/user.entity';
import { FileService } from 'src/infrastructure/file/file.service';
import { responseByLang } from 'src/infrastructure/prompts/responsePrompts';
import { ResponseTypes } from 'src/common/database/Enums';
import { PaginationDto } from 'src/infrastructure/query/dto/pagination.dto';
import { FilterDto } from 'src/infrastructure/query/dto/filter.dto';
import { QueryHelperService } from 'src/infrastructure/query/query-helper';
import { GetProductsDto } from 'src/infrastructure/query/dto/query.dto';
import { MoreThanOrEqual } from 'typeorm';
import { subMonths } from 'date-fns';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly fileService: FileService
  ) { }

  // Create Product
  async create(createProductDto: CreateProductDto, file: Express.Multer.File, user: UserEntity, lang: string) {
    const imagePath = await this.fileService.saveFile(file);
    const product = this.productRepository.create({
      ...createProductDto,
      image: imagePath,
      created_by: user,
      created_at: Date.now()
    });

    await this.productRepository.save(product);

    return { data: product, status_code: 201, message: responseByLang(ResponseTypes.CREATE, lang) };
  }
  async findNews(lang: string) {

    const oneMonthAgo = subMonths(new Date(), 1).getTime();

    const products = await this.productRepository.find({
      where: {
        is_deleted: false,
        created_at: MoreThanOrEqual(oneMonthAgo)
      }
    });

    return { data: products, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ALL, lang) };
  }

  // Get All Products
  async findAll(query: GetProductsDto, lang: string): Promise<any> {
    try {
      const { page, limit, search } = query;

      const queryBuilder = this.productRepository.createQueryBuilder('product')
        .where('product.is_deleted = :isDeleted', { isDeleted: false });

      const result = await QueryHelperService.paginateAndFilter(
        queryBuilder,
        { page, limit }, // Pagination
        { search },      // Filter
        ['product.name', 'product.description']
      );

      return {
        data: result.items,
        total: result.total,
        status_code: 200,
        message: responseByLang(ResponseTypes.FETCH_ALL, lang),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving products: ' + error.message);
    }
  }


  // Get Product By ID
  async findOne(id: string, lang: string) {
    const product = await this.productRepository.findOne({ where: { id, is_deleted: false } });

    if (!product) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    return { data: product, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ONE, lang) };
  }

  // Update Product
  async update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File, user?: UserEntity, lang?: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    if (file) {
      const imagePath = await this.fileService.saveFile(file);
      product.image = imagePath;
    }

    Object.assign(product, updateProductDto);
    product.updated_by = user;
    product.updated_at = Date.now();

    await this.productRepository.save(product);

    return { data: product, status_code: 200, message: responseByLang(ResponseTypes.UPDATE, lang) };
  }

  // Soft Delete Product
  async remove(id: string, user: UserEntity, lang: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }
    product.is_deleted = true;
    product.deleted_at = Date.now();
    product.deleted_by = user;

    await this.productRepository.save(product);

    return { data: null, status_code: 200, message: responseByLang(ResponseTypes.DELETE, lang) };
  }
}
