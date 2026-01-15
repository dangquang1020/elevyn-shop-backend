/**
 * Database Schema Barrel Export
 *
 * This file re-exports all domain module schemas for use with Drizzle ORM.
 * Each module maintains its own schema definitions close to the code that uses them.
 *
 * Module structure:
 * - auth: users, refresh_tokens
 * - catalog: categories, products
 * - cart: cart_items
 * - orders: addresses, orders, order_items
 */

// Auth module
export * from '../modules/auth/auth.schema';

// Catalog module
export * from '../modules/catalog/catalog.schema';

// Cart module
export * from '../modules/cart/cart.schema';

// Orders module
export * from '../modules/orders/orders.schema';
