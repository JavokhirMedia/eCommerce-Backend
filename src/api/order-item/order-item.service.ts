import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemEntity } from 'src/core/entity/order-item.entity';
import { ProductEntity } from 'src/core/entity/product.entity';
import { UserEntity } from 'src/core/entity/user.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { ResponseTypes, Roles } from 'src/common/database/Enums';
import { responseByLang } from 'src/infrastructure/prompts/responsePrompts';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) { }

  // **1️⃣ Create Order Item**
  async createOrderItem(createOrderItemDto: CreateOrderItemDto, user: UserEntity, lang: string) {
    const { productId, quantity } = createOrderItemDto;

    const product = await this.productRepository.findOne({
      where: { id: productId, is_deleted: false },
    });

    if (!product) {
      throw new NotFoundException(responseByLang(ResponseTypes.PRODUCT_NOT_FOUND, lang));
    }

    const orderItem = this.orderItemRepository.create({
      product,
      quantity,
      price: product.price * quantity,
      created_by: user,
      created_at: Date.now(),
    });

    await this.orderItemRepository.save(orderItem);

    return { data: orderItem, status_code: 201, message: responseByLang(ResponseTypes.CREATE, lang) };
  }

  // **2️⃣ Get all Order Items (Admin only)**
  async getAllOrderItems(lang: string) {
    const orderItems = await this.orderItemRepository.find({
      relations: ['product'],
    });

    return { data: orderItems, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ALL, lang) };
  }


  // **4️⃣ Get Order Item by ID**
  async getOrderItemById(id: string, currentUser: UserEntity, lang: string) {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['user', 'product'],
    });

    if (!orderItem) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    return { data: orderItem, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ONE, lang) };
  }

  // **5️⃣ Delete Order Item**
  async deleteOrderItem(id: string, currentUser: UserEntity, lang: string) {
    if (currentUser.role !== Roles.ADMIN) {
      throw new ForbiddenException(responseByLang(ResponseTypes.FORBIDDEN, lang));
    }

    const orderItem = await this.orderItemRepository.findOne({ where: { id } });

    if (!orderItem) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    orderItem.is_deleted = true;
    orderItem.deleted_by = currentUser;
    orderItem.deleted_at = Date.now();

    await this.orderItemRepository.save(orderItem);

    return { data: null, status_code: 200, message: responseByLang(ResponseTypes.DELETE, lang) };
  }
}
