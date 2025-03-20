import { Repository } from "typeorm";
import { OrderEntity } from "../entity";
export type OrderRepository = Repository<OrderEntity>;
