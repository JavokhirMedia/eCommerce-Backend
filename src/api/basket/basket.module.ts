import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from 'src/core/entity/basket.entity';
import { ProductEntity } from 'src/core/entity/product.entity';
import { ProductService } from '../product/product.service';
import { UserEntity } from 'src/core/entity/user.entity';
import { FileService } from 'src/infrastructure/file/file.service';
import { ImageEntity } from 'src/core/entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasketEntity, ProductEntity, UserEntity, ImageEntity])],
  controllers: [BasketController],
  providers: [BasketService, ProductService, FileService],
})
export class BasketModule { }
