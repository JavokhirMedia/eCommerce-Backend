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
import { GetProductsDto } from 'src/infrastructure/query/dto/query.dto';
import { MoreThanOrEqual } from 'typeorm';
import { subMonths } from 'date-fns';
import { ImageEntity } from 'src/core/entity/image.entity';
import { QueryHelperService } from 'src/infrastructure/query/query-helper';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly fileService: FileService,
  ) { }

  // Create Product
  async create(createProductDto: CreateProductDto, files: Express.Multer.File[], user: UserEntity, lang: string) {
    const imagePaths = await this.fileService.saveFiles(files);
    const product = this.productRepository.create({
      ...createProductDto,
      created_by: user,
      created_at: Date.now(),
    });

    await this.productRepository.save(product);

    const images = imagePaths.map((path) => this.imageRepository.create({ path, product }));
    await this.imageRepository.save(images);

    return { data: product, status_code: 201, message: responseByLang(ResponseTypes.CREATE, lang) };
  }

  // Get latest products (last month)
  async findNews(lang: string) {
    const oneMonthAgo = subMonths(new Date(), 1).getTime(); // Bir oy oldin timestamp

    const products = await this.productRepository.find({
      where: {
        is_deleted: false,
        created_at: MoreThanOrEqual(oneMonthAgo as any), // 'as any' TypeORM tip xatosini oldini olish uchun
      },
    });

    return { data: products, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ALL, lang) };
  }


  // Get All Products
  async findAll(query: GetProductsDto, lang: string) {
    try {
      const { page, limit, search } = query;
      const queryBuilder = this.productRepository.createQueryBuilder('product')
        .where('product.is_deleted = :isDeleted', { isDeleted: false });

      const result = await QueryHelperService.paginateAndFilter(
        queryBuilder,
        { page, limit },
        { search },
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
    const product = await this.productRepository.findOne({ where: { id, is_deleted: false }, relations: ['images'] });

    if (!product) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    return { data: product, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ONE, lang) };
  }

  // Update Product
  async update(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[], user?: UserEntity, lang?: string) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['images'] });

    if (!product) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    if (files && files.length > 0) {
      for (const image of product.images) {
        await this.fileService.deleteFile(image.path);
      }
      await this.imageRepository.remove(product.images);

      const imagePaths = await this.fileService.saveFiles(files);
      const newImages = imagePaths.map((path) => this.imageRepository.create({ path, product }));
      await this.imageRepository.save(newImages);
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
