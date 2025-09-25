import { pgTable, text, integer, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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

// Type inference helpers
export type FoodItem = typeof foodItems.$inferSelect;
export type NewFoodItem = typeof foodItems.$inferInsert;

// Zod schemas for validation
export const insertFoodItemSchema = createInsertSchema(foodItems);
export const selectFoodItemSchema = createSelectSchema(foodItems);