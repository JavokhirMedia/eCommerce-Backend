import { Repository } from "typeorm";
import { ProductEntity } from "../entity";
export type ProductRepository = Repository<ProductEntity>;
