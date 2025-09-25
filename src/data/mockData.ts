import { FoodItem } from "@/types/food";

export const mockFoodItems: FoodItem[] = [
  // Breakfast
  {
    id: "1",
    name: "Classic Pancakes",
    description: "Fluffy pancakes served with maple syrup and butter",
    price: 120,
    category: "Breakfast",
    image: "/food-pancakes.jpg",
    tags: ["Vegetarian", "Sweet"],
    available: true,
    preparationTime: 15
  },
  {
    id: "2",
    name: "Masala Dosa",
    description: "Crispy dosa with potato filling, served with sambar and chutney",
    price: 80,
    category: "Breakfast",
    image: "/food-dosa.jpg",
    tags: ["Vegetarian", "South Indian"],
    available: true,
    preparationTime: 20
  },
  {
    id: "3",
    name: "Egg Benedict",
    description: "Poached eggs on English muffins with hollandaise sauce",
    price: 150,
    category: "Breakfast",
    image: "/food-eggs.jpg",
    tags: ["Non-Vegetarian"],
    available: true,
    preparationTime: 18
  },
  
  // Lunch
  {
    id: "4",
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken and spices",
    price: 180,
    category: "Lunch",
    image: "/food-biryani.jpg",
    tags: ["Non-Vegetarian", "Spicy"],
    available: true,
    preparationTime: 25
  },
  {
    id: "5",
    name: "Paneer Butter Masala",
    description: "Cottage cheese in rich tomato gravy, served with naan",
    price: 160,
    category: "Lunch",
    image: "/food-paneer.jpg",
    tags: ["Vegetarian", "North Indian"],
    available: true,
    preparationTime: 20
  },
  {
    id: "6",
    name: "Grilled Sandwich",
    description: "Triple-layered sandwich with vegetables and cheese",
    price: 90,
    category: "Lunch",
    image: "/food-sandwich.jpg",
    tags: ["Vegetarian", "Continental"],
    available: true,
    preparationTime: 12
  },
  
  // Snacks
  {
    id: "7",
    name: "Samosa",
    description: "Crispy pastry with spiced potato filling",
    price: 30,
    category: "Snacks",
    image: "/food-samosa.jpg",
    tags: ["Vegetarian", "Fried"],
    available: true,
    preparationTime: 10
  },
  {
    id: "8",
    name: "French Fries",
    description: "Crispy golden fries with seasoning",
    price: 60,
    category: "Snacks",
    image: "/food-fries.jpg",
    tags: ["Vegetarian", "Fried"],
    available: true,
    preparationTime: 8
  },
  {
    id: "9",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with vanilla ice cream",
    price: 80,
    category: "Snacks",
    image: "/food-brownie.jpg",
    tags: ["Vegetarian", "Dessert"],
    available: false,
    preparationTime: 5
  },
  
  // Beverages
  {
    id: "10",
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    price: 70,
    category: "Beverages",
    image: "/food-coffee.jpg",
    tags: ["Hot", "Coffee"],
    available: true,
    preparationTime: 5
  },
  {
    id: "11",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 60,
    category: "Beverages",
    image: "/food-juice.jpg",
    tags: ["Cold", "Fresh"],
    available: true,
    preparationTime: 3
  },
  {
    id: "12",
    name: "Mango Lassi",
    description: "Creamy yogurt drink with mango",
    price: 50,
    category: "Beverages",
    image: "/food-lassi.jpg",
    tags: ["Cold", "Sweet"],
    available: true,
    preparationTime: 5
  }
];