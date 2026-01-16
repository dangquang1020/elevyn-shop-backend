import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart() {
    // TODO: Get userId from auth
    const userId = 'temp-user-id';
    return this.cartService.getCart(userId);
  }

  @Post()
  addToCart(@Body() body: { productId: string; quantity: number }) {
    // TODO: Get userId from auth
    const userId = 'temp-user-id';
    return this.cartService.addToCart(userId, body.productId, body.quantity);
  }

  @Delete(':id')
  removeFromCart(@Param('id') id: string) {
    return this.cartService.removeFromCart(id);
  }
}
