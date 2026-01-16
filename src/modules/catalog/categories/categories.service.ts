import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../../../database';
import type { DrizzleDB } from '../../../database';
import { categories } from '../catalog.schema';
import { eq, isNull } from 'drizzle-orm';

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE_DB) private db: DrizzleDB) {}

  async findAll() {
    return this.db.select().from(categories);
  }

  async findRootCategories() {
    return this.db.select().from(categories).where(isNull(categories.parentId));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async findBySlug(slug: string) {
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    return result[0] ?? null;
  }
}
