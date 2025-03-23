import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus, Roles } from 'src/common/database/Enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserEntity } from 'src/core/entity/user.entity';
import { RolesGuard } from '../auth/roles/RoleGuard';
import { JwtAuthGuard } from '../auth/users/AuthGuard';
import { RolesDecorator } from '../auth/roles/RolesDecorator';
import { ImageValidationPipe } from 'src/common/pipes/image.pipe';
import { CurrentLanguage } from 'src/common/decorator/current-language';
import { PaginationDto } from 'src/infrastructure/query/dto/pagination.dto';
import { FilterDto } from 'src/infrastructure/query/dto/filter.dto';
import { GetProductsDto } from 'src/infrastructure/query/dto/query.dto';

@ApiTags('Products')
@ApiBearerAuth("access-token")
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // Create product
  @Post()
  @RolesDecorator(Roles.ADMIN, Roles.USER, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('files', 5)) // 5 ta faylgacha yuklash mumkin
  @UsePipes(ImageValidationPipe)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        status: { type: 'string', enum: Object.values(ProductStatus) },
        categoryId: { type: 'string' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' }, // Bir nechta fayl qabul qilish
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[], // Bir nechta faylni olish
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string
  ) {
    return this.productService.create(createProductDto, files, currentUser, lang);
  }

  // Get all products 
  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'List of products' })
  @ApiQuery({ name: 'lang', required: false, description: 'Language (en, ru, uz)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by product name or description' })
  async findAll(
    @Query(ValidationPipe) query: GetProductsDto,
    @Query('lang') lang: string
  ) {
    return this.productService.findAll(query, lang);
  }

  // Get product by ID
  @Get('/new')
  @ApiOperation({ summary: 'Get new products' })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @ApiResponse({ status: 200, description: 'Products found' })
  @ApiResponse({ status: 404, description: 'Products not found' })
  findNews(
    @CurrentLanguage() lang: string
  ) {
    return this.productService.findNews(lang);
  }

  // Get product by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(
    @Param('id') id: string,
    @CurrentLanguage() lang: string
  ) {
    return this.productService.findOne(id, lang);
  }

  // Update product
  @Patch(':id')
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('files', 5)) // 5 ta faylgacha yuklash mumkin
  @UsePipes(ImageValidationPipe)
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        status: { type: 'string', enum: Object.values(ProductStatus) },
        categoryId: { type: 'string' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' }, 
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product successfully updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[], 
  ) {
    return this.productService.update(id, updateProductDto, files, currentUser, lang);
  }


  // Delete product
  @Delete(':id')
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string
  ) {
    return this.productService.remove(id, currentUser, lang);
  }
}
