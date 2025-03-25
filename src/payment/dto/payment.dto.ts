import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsObject,
  IsArray,
} from 'class-validator';

export class PreparePaymentDto {
  @IsString()
  @IsNotEmpty()
  shopTransactionId: string;

  @IsNumber()
  totalSum: number;

  @IsObject()
  userData: {
    user_id: string;
    phone: string;
    email: string;
  };

  @IsArray()
  basket: {
    position_desc: string;
    count: number;
    price: number;
    spic?: string;
  }[];
}
