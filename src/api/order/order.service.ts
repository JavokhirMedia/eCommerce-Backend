import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from 'src/core/entity/order.entity';
import { UserEntity } from 'src/core/entity/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseTypes, Roles } from 'src/common/database/Enums';
import { responseByLang } from 'src/infrastructure/prompts/responsePrompts';
import { BasketEntity } from 'src/core/entity';
import { OrderItemEntity } from 'src/core/entity/order-item.entity';
import { toASCII } from 'punycode';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(BasketEntity)
    private readonly basketRepository: Repository<BasketEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,

  ) { }

  // **1️⃣ Create Order**
  async createOrder(createOrderDto: CreateOrderDto, user: UserEntity, lang: string) {
    // ✅ Basket ichidagi mahsulotlarni olish
    const basketItems = await this.basketRepository.find({
      where: { user: { id: user.id } },
      relations: ['product'],
    });

    if (basketItems.length === 0) {
      throw new NotFoundException(responseByLang(ResponseTypes.NO_DATA, lang));
    }

    // ✅ Order yaratish
    const order = this.orderRepository.create({
      user: { id: user.id } as UserEntity,
      address: createOrderDto.address,
      latitude: Number(createOrderDto.latitude),
      longitude: Number(createOrderDto.longitude),
      created_by: user,
      created_at: Date.now(),
    });

    let total_sum = 0

    // ✅ Basketdagi mahsulotlarni OrderItem sifatida yaratish
    const orderItems = basketItems.map(basketItem => {
      if (basketItem.product.stock < basketItem.quantity) {
        throw new BadRequestException('Bazada tovar yetarli emas')
      }
      total_sum += basketItem.product.price * basketItem.quantity
      return this.orderItemRepository.create({
        order: { id: order.id } as OrderEntity,
        product: { id: basketItem.product.id },
        quantity: basketItem.quantity,
        price: basketItem.product.price * basketItem.quantity,
        created_by: user,
        created_at: Date.now(),
      });
    });
    order.total_sum = total_sum
    await this.orderRepository.save(order);
    await this.orderItemRepository.save(orderItems);

    // ✅ Basketni tozalash (foydalanuvchi savatidagi mahsulotlarni o‘chirish)
    await this.basketRepository.remove(basketItems);

    return {
      data: { order },
      status_code: 201,
      message: responseByLang(ResponseTypes.CREATE, lang)
    };
  }



  // **2️⃣ Get all orders (Admin only)**
  async getAllOrders(lang: string) {
    const orders = await this.orderRepository.find({
      relations: ['user', 'orderItems'],
    });

    return { data: orders, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ALL, lang) };
  }

  // **3️⃣ Get orders by user**
  async getUserOrders(user: UserEntity, lang: string) {
    const orders = await this.orderRepository.find({
      where: { user: { id: user.id }, is_deleted: false },
      relations: ['user', 'orderItems'],
    });

    return { data: orders, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ALL, lang) };
  }

  // **4️⃣ Get order by ID**
  async getOrderById(id: string, currentUser: UserEntity, lang: string) {
    const order = await this.orderRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['user', 'orderItems'],
    });

    if (!order) {
      throw new NotFoundException(responseByLang(ResponseTypes.ORDER_NOT_FOUND, lang));
    }

    if (order.user.id !== currentUser.id && currentUser.role !== Roles.ADMIN && currentUser.role !== Roles.SUPER_ADMIN) {
      throw new ForbiddenException(responseByLang(ResponseTypes.FORBIDDEN, lang));
    }

    return { data: order, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ONE, lang) };
  }

  // **5️⃣ Update Order**
  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderDto,
    currentUser: UserEntity,
    lang: string
  ) {
    if (currentUser.role !== Roles.ADMIN) {
      throw new ForbiddenException(responseByLang(ResponseTypes.FORBIDDEN, lang));
    }

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(responseByLang(ResponseTypes.ORDER_NOT_FOUND, lang));
    }

    order.status = updateOrderStatusDto.status;
    order.updated_by = currentUser;
    order.updated_at = Date.now();

    await this.orderRepository.save(order);

    return { data: order, status_code: 200, message: responseByLang(ResponseTypes.UPDATE, lang) };
  }


  // **6️⃣ Delete Order (Admin only)**
  async deleteOrder(id: string, currentUser: UserEntity, lang: string) {
    if (currentUser.role !== Roles.ADMIN) {
      throw new ForbiddenException(responseByLang(ResponseTypes.FORBIDDEN, lang));
    }

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(responseByLang(ResponseTypes.ORDER_NOT_FOUND, lang));
    }

    order.is_deleted = true;
    order.deleted_by = currentUser;
    order.deleted_at = Date.now();

    await this.orderRepository.save(order);

    return { data: null, status_code: 200, message: responseByLang(ResponseTypes.DELETE, lang) };
  }
}
