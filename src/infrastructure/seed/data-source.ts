import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../core/entity/user.entity';
import { CategoryEntity } from '../../core/entity/category.entity';
import { ProductEntity } from '../../core/entity/product.entity';
import { OrderEntity } from '../../core/entity/order.entity';
import { BasketEntity } from '../../core/entity/basket.entity';
import { OrderItemEntity } from '../../core/entity/order-item.entity';
import { config } from 'src/config';


export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.DB_URL,
  entities: [
    UserEntity,
    CategoryEntity,
    ProductEntity,
    OrderEntity,
    BasketEntity,
    OrderItemEntity,
  ],
  synchronize: true, // Dev uchun true, prod uchun false qiling
  logging: true,
});
