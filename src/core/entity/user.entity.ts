import { BaseEntity } from '../../common/database/BaseEntity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Roles } from "src/common/database/Enums";
import { BasketEntity } from './basket.entity';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { CommentEntity } from './comment.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    last_name: string 

    @Column({ nullable: true })
    birth_date: string

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ unique: true, nullable: true })
    phone: string

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({
        type: 'enum',
        enum: Roles,
        default: Roles.USER,
    })
    role: Roles;

    @OneToMany(() => ProductEntity, (product) => product.user)
    products: ProductEntity[];

    @OneToMany(() => BasketEntity, (basketItem) => basketItem.user)
    basketItems: BasketEntity[];

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.created_by)
    comments: CommentEntity[];
}
