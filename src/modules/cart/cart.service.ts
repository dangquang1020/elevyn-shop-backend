import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../../database';
import type { DrizzleDB } from '../../database';
import { cartItems } from './cart.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CartService {
  constructor(@Inject(DRIZZLE_DB) private db: DrizzleDB) {}

  async getCart(userId: string) {
    return this.db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    // TODO: Handle existing item (upsert)
    return this.db
      .insert(cartItems)
      .values({
        userId,
        productId,
        quantity,
      })
      .returning();
  }

  async removeFromCart(id: string) {
    return this.db.delete(cartItems).where(eq(cartItems.id, id)).returning();
  }
}
