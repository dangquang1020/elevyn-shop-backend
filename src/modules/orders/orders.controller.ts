import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    // TODO: Get userId from auth
    const userId = 'temp-user-id';
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  create(@Body() body: any) {
    // TODO: Get userId from auth
    const userId = 'temp-user-id';
    return this.ordersService.create(userId, body);
  }
}
