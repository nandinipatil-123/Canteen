import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { foodItems } from "../src/server/db/schema";
import { mockFoodItems } from "../src/data/mockData";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Convert mock data to match database schema
    const foodData = mockFoodItems.map(item => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      tags: item.tags,
      available: item.available,
      preparationTime: item.preparationTime,
    }));

    // Insert food items
    await db.insert(foodItems).values(foodData);

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Inserted ${foodData.length} food items`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();