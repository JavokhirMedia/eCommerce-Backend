import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProductEntity } from 'src/core/entity/product.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
    parent: CategoryEntity;

    @OneToMany(() => CategoryEntity, (category) => category.parent)
    children: CategoryEntity[];

    @OneToMany(() => ProductEntity, (product) => product.category)
    products: ProductEntity[];
}
