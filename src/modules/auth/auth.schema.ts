import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../users/users.schema';

// ============================================================================
// REFRESH TOKENS TABLE
// ============================================================================

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 255 }).notNull(),
    deviceInfo: varchar('device_info', { length: 255 }),
    ipAddress: varchar('ip_address', { length: 45 }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    isRevoked: boolean('is_revoked').default(false).notNull(),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('refresh_tokens_token_hash_idx').on(table.tokenHash),
    index('refresh_tokens_user_id_idx').on(table.userId),
  ],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));
