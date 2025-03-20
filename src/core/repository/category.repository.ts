import { Repository } from "typeorm";
import { CategoryEntity } from "../entity";
export type CategoryRepository = Repository<CategoryEntity>;
