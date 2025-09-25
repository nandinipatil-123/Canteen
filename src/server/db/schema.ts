import { pgTable, text, integer, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const foodItems = pgTable("food_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  tags: text("tags").array().notNull().default([]),
  available: boolean("available").notNull().default(true),
  preparationTime: integer("preparation_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), // Firebase UID
  userEmail: text("user_email").notNull(),
  userName: text("user_name"),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready, delivered, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  foodItemId: uuid("food_item_id").notNull().references(() => foodItems.id),
  quantity: integer("quantity").notNull(),
  priceAtTime: integer("price_at_time").notNull(), // Price when order was placed
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  foodItem: one(foodItems, {
    fields: [orderItems.foodItemId],
    references: [foodItems.id],
  }),
}));

export const foodItemsRelations = relations(foodItems, ({ many }) => ({
  orderItems: many(orderItems),
}));

// Type inference helpers
export type FoodItem = typeof foodItems.$inferSelect;
export type NewFoodItem = typeof foodItems.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

// Zod schemas for validation
export const insertFoodItemSchema = createInsertSchema(foodItems);
export const selectFoodItemSchema = createSelectSchema(foodItems);

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderItemSchema = createInsertSchema(orderItems);
export const selectOrderItemSchema = createSelectSchema(orderItems);