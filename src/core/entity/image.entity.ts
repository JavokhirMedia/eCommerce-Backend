import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/database/BaseEntity';
import { ProductEntity } from './product.entity';


@Entity('image')
export class ImageEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    path: string;

    @ManyToOne(() => ProductEntity, (product) => product.image)
    product: ProductEntity;
}
