import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderItemEntity } from 'src/core/entity/order-item.entity';
import { OrderEntity } from 'src/core/entity/order.entity';
import { ProductEntity } from 'src/core/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemEntity, OrderEntity, ProductEntity])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule { }
