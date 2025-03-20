import { Repository } from "typeorm";
import { BasketEntity } from "../entity";

export type BasketRepository = Repository<BasketEntity>;
