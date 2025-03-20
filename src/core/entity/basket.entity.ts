import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { ProductEntity } from './product.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity('baskets')
export class BasketEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, (user) => user.basketItems, { onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToOne(() => ProductEntity, (product) => product.basketItems, { onDelete: 'CASCADE' })
    product: ProductEntity;

    @Column({ type: 'int', default: 1 })
    quantity: number;
}
