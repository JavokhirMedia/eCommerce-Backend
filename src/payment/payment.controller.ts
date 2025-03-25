import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PreparePaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('prepare')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async preparePayment(@Body() paymentData: PreparePaymentDto) {
    const paymentResponse = await this.paymentService.preparePayment(
      paymentData.shopTransactionId,
      paymentData.totalSum,
      paymentData.userData,
      paymentData.basket,
    );

    return paymentResponse;
  }
}
