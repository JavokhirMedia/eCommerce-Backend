import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasketEntity } from 'src/core/entity/basket.entity';
import { ProductEntity } from 'src/core/entity/product.entity';
import { UserEntity } from 'src/core/entity/user.entity';
import { responseByLang } from 'src/infrastructure/prompts/responsePrompts';
import { ResponseTypes } from 'src/common/database/Enums';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private readonly basketRepository: Repository<BasketEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) { }

  // **1️⃣ Add product to basket**
  async addProduct(createBasketDto, user: UserEntity, lang: string) {
    const { productId, quantity } = createBasketDto;
    const product = await this.productRepository.findOne({
      where: { id: productId, is_deleted: false },
    });


    if (!product) {
      throw new NotFoundException(responseByLang(ResponseTypes.PRODUCT_NOT_FOUND, lang));
    }

    let basketItem = await this.basketRepository.findOne({
      where: { user: { id: user.id }, product, is_deleted: false },
    });

    if (basketItem) {
      basketItem.quantity += quantity;
      basketItem.updated_by = user;
    } else {
      basketItem = this.basketRepository.create({
        user,
        product,
        quantity,
        created_by: user,
      });
    }

    await this.basketRepository.save(basketItem);
    return { data: basketItem, status_code: 201, message: responseByLang(ResponseTypes.CREATE, lang) };
  }

  // **2️⃣ Get all products in basket**
  async getBasket(user: UserEntity, lang: string) {
    const basket = await this.basketRepository.find({
      where: { user: { id: user.id }, is_deleted: false },
      relations: ['product'],
    });

    return { data: basket, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ALL, lang) };
  }

  // **3️⃣ Update quantity of product in basket** 
  async updateQuantity(id: string, quantity: number, user: UserEntity, lang: string) {
    const basketItem = await this.basketRepository.findOne({
      where: { id, user: { id: user.id }, is_deleted: false },
    });

    if (!basketItem) {
      throw new NotFoundException(responseByLang(ResponseTypes.BASKET_ITEM_NOT_FOUND, lang));
    }

    basketItem.quantity = quantity;
    basketItem.updated_by = user;
    basketItem.updated_at = Date.now();

    await this.basketRepository.save(basketItem);
    return { data: basketItem, status_code: 200, message: responseByLang(ResponseTypes.UPDATE, lang) };
  }

  // **4️⃣ Remove product from basket (Soft delete)**
  async removeProduct(id: string, user: UserEntity, lang: string) {
    const basketItem = await this.basketRepository.findOne({
      where: { id, user: { id: user.id }, is_deleted: false },
    });

    if (!basketItem) {
      throw new NotFoundException(responseByLang(ResponseTypes.BASKET_ITEM_NOT_FOUND, lang));
    }

    basketItem.is_deleted = true;
    basketItem.deleted_at = Date.now();
    basketItem.deleted_by = user;

    await this.basketRepository.save(basketItem);
    return { data: null, status_code: 200, message: responseByLang(ResponseTypes.DELETE, lang) };
  }

  // **5️⃣ Clear basket (Soft delete all)**
  async clearBasket(user: UserEntity, lang: string) {
    const basketItems = await this.basketRepository.find({
      where: { user: { id: user.id }, is_deleted: false },
    });

    if (!basketItems.length) {
      throw new NotFoundException(responseByLang(ResponseTypes.BASKET_ITEM_NOT_FOUND, lang));
    }

    basketItems.forEach((item) => {
      item.is_deleted = true;
      item.deleted_at = Date.now();
      item.deleted_by = user;
    });

    await this.basketRepository.save(basketItems);
    return { data: null, status_code: 200, message: responseByLang(ResponseTypes.BASKET_CLEARED, lang) };
  }
}
