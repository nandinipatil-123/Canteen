import type { FoodItem } from "@/types/food";

// Use relative path for API calls - will work in both development and production
const API_BASE = '/api';

export class AuthService {
  static async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      return response.ok;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  static async logout(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

  static async checkAuth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/auth/check`, {
        credentials: 'include',
      });

      if (!response.ok) return false;
      
      const { isAdmin } = await response.json();
      return isAdmin;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  }
}

export class FoodService {
  static async getAllFoodItems(): Promise<FoodItem[]> {
    try {
      const response = await fetch(`${API_BASE}/food-items`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching food items:", error);
      return [];
    }
  }

  static async getFoodItemById(id: string): Promise<FoodItem | null> {
    try {
      const response = await fetch(`${API_BASE}/food-items/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching food item:", error);
      return null;
    }
  }

  static async getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
    try {
      const allItems = await this.getAllFoodItems();
      return allItems.filter(item => item.category === category);
    } catch (error) {
      console.error("Error fetching food items by category:", error);
      return [];
    }
  }

  static async getAvailableFoodItems(): Promise<FoodItem[]> {
    try {
      const allItems = await this.getAllFoodItems();
      return allItems.filter(item => item.available);
    } catch (error) {
      console.error("Error fetching available food items:", error);
      return [];
    }
  }

  static async createFoodItem(item: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FoodItem | null> {
    try {
      const response = await fetch(`${API_BASE}/food-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating food item:", error);
      return null;
    }
  }

  static async updateFoodItem(id: string, updates: Partial<Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FoodItem | null> {
    try {
      const response = await fetch(`${API_BASE}/food-items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating food item:", error);
      return null;
    }
  }

  static async deleteFoodItem(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/food-items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      return response.ok;
    } catch (error) {
      console.error("Error deleting food item:", error);
      return false;
    }
  }

  static async toggleAvailability(id: string): Promise<FoodItem | null> {
    try {
      const response = await fetch(`${API_BASE}/food-items/${id}/toggle`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error toggling food item availability:", error);
      return null;
    }
  }
}