import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { Roles } from 'src/common/database/Enums';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserEntity } from 'src/core/entity/user.entity';
import { RolesGuard } from '../auth/roles/RoleGuard';
import { JwtAuthGuard } from '../auth/users/AuthGuard';
import { RolesDecorator } from '../auth/roles/RolesDecorator';
import { CurrentLanguage } from 'src/common/decorator/current-language';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Order Items')
@ApiBearerAuth('access-token')
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  // **1️⃣ Create Order Item**
  @Post('create')
  @RolesDecorator(Roles.USER, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({ status: 201, description: 'Order item successfully created' })
  createOrderItem(
    @Body() createOrderItemDto: CreateOrderItemDto,
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string,
  ) {
    return this.orderItemService.createOrderItem(createOrderItemDto, currentUser, lang);
  }

  // **2️⃣ Get all Order Items (Admin only)**
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @UseGuards(RolesGuard)
  @Get()
  @ApiQuery({ name: 'lang', required: false, description: 'Language (en, ru, uz)' })
  @ApiOperation({ summary: 'Get all order items (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all order items' })
  getAllOrderItems(@CurrentLanguage() lang: string) {
    return this.orderItemService.getAllOrderItems(lang);
  }

  // **4️⃣ Get Order Item by ID**
  @Get(':id')
  @RolesDecorator(Roles.USER, Roles.ADMIN, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({ name: 'lang', required: false, description: 'Language (en, ru, uz)' })
  @ApiOperation({ summary: 'Get order item by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Order Item ID' })
  @ApiResponse({ status: 200, description: 'Order item details' })
  getOrderItemById(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string,
  ) {
    return this.orderItemService.getOrderItemById(id, currentUser, lang);
  }

  // **6️⃣ Delete Order Item (Admin only)**
  @Delete(':id')
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({ name: 'lang', required: false, description: 'Language (en, ru, uz)' })
  @ApiOperation({ summary: 'Delete order item by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Order Item ID' })
  @ApiResponse({ status: 200, description: 'Order item deleted successfully' })
  deleteOrderItem(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string,
  ) {
    return this.orderItemService.deleteOrderItem(id, currentUser, lang);
  }
}
