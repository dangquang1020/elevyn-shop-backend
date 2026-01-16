/**
 * Database Schema Barrel Export
 *
 * This file re-exports all domain module schemas for use with Drizzle ORM.
 * Each module maintains its own schema definitions close to the code that uses them.
 *
 * Module structure:
 * - users: users, addresses
 * - auth: refresh_tokens
 * - catalog: categories, products
 * - cart: cart_items
 * - orders: orders, order_items
 */

// Users module (must be first - other modules depend on it)
export * from '../modules/users/users.schema';

// Auth module
export * from '../modules/auth/auth.schema';

// Catalog module
export * from '../modules/catalog/catalog.schema';

// Cart module
export * from '../modules/cart/cart.schema';

// Orders module
export * from '../modules/orders/orders.schema';
