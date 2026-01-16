import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../../../database';
import type { DrizzleDB } from '../../../database';
import { products } from '../catalog.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductsService {
  constructor(@Inject(DRIZZLE_DB) private db: DrizzleDB) {}

  async findAll() {
    return this.db.select().from(products).where(eq(products.isActive, true));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async findBySlug(slug: string) {
    const result = await this.db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    return result[0] ?? null;
  }
}
