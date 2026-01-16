import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  decimal,
  integer,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users, addresses } from '../users/users.schema';
import { products } from '../catalog/catalog.schema';

// ============================================================================
// ENUMS
// ============================================================================

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]);

// ============================================================================
// ORDERS TABLE
// ============================================================================

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    shippingAddressId: uuid('shipping_address_id').references(
      () => addresses.id,
      { onDelete: 'set null' },
    ),
    orderNumber: varchar('order_number', { length: 50 }).notNull(),
    status: orderStatusEnum('status').default('pending').notNull(),
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    tax: decimal('tax', { precision: 10, scale: 2 }).default('0').notNull(),
    shipping: decimal('shipping', { precision: 10, scale: 2 })
      .default('0')
      .notNull(),
    total: decimal('total', { precision: 10, scale: 2 }).notNull(),
    paymentIntentId: varchar('payment_intent_id', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('orders_order_number_idx').on(table.orderNumber),
    index('orders_user_id_idx').on(table.userId),
    index('orders_status_idx').on(table.status),
  ],
);

// ============================================================================
// ORDER ITEMS TABLE
// ============================================================================

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [index('order_items_order_id_idx').on(table.orderId)],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
