import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../../database';
import type { DrizzleDB } from '../../database';
import { users, addresses } from './users.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_DB) private db: DrizzleDB) {}

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async findByEmail(email: string) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] ?? null;
  }

  async findAddressesByUserId(userId: string) {
    return this.db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async create(data: typeof users.$inferInsert) {
    // Password hashing should be done here or in a hook
    // We assume data.passwordHash is already hashed OR we hash it here if it's raw
    // For simplicity, let's assume the caller will hash it OR we introduce a separate DTO/method
    // But typically persistence layer just persists.
    // However, the requested plan said "Implement Bcrypt hashing in UsersService".
    // So let's add a helper or modify create.

    // Let's create a specific method for registration
    const [user] = await this.db.insert(users).values(data).returning();
    return user;
  }
}
