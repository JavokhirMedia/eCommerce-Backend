import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ProductEntity } from 'src/core/entity/product.entity';
import { UserEntity } from 'src/core/entity/user.entity';
import { FileService } from 'src/infrastructure/file/file.service';
import { QueryHelperService } from 'src/infrastructure/query/query-helper';
import { ImageEntity } from 'src/core/entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, UserEntity, ImageEntity]), MulterModule],
  controllers: [ProductController],
  providers: [ProductService, FileService, QueryHelperService],
})
export class ProductModule { }
