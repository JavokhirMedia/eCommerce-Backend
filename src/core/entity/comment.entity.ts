import { BaseEntity } from "src/common/database/BaseEntity";
import { UserEntity } from "./user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity('comments')
export class CommentEntity extends BaseEntity {
    @Column()
    content: string

    @ManyToOne(() => ProductEntity, (product) => product.comments)
    product: ProductEntity;
}