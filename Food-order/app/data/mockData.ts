// ── Category interface: name, emoji, and brand color ───────────────────────────
export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string; // Brand color for UI (selection highlight, badges, etc.)
}

// ── Restaurant interface: metadata for each restaurant ──────────────────────────
export interface Restaurant {
  id: string;
  name: string;
  category: string; // Type of cuisine
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  emoji: string;
  bgColor: string;
  description: string;
  tags: string[]; // e.g., ['Popular', 'Hot', 'Vegetarian']
}

// ── FoodItem interface: individual food product ────────────────────────────
export interface FoodItem {
  id: string;
  restaurantId: string; // Which restaurant this item is from
  name: string;
  price: number;
  category: string;
  emoji: string;
  rating: number;
  reviews: number;
  description: string;
  calories: number;
  prepTime: string;
  tags: string[]; // e.g., ['Spicy', 'Vegan', 'New']
  bgColor: string;
}

// ── Category list: All, Pizza, Sushi, Burger, etc. ───────────────────────
export const CATEGORIES: Category[] = [
  { id: "1", name: "All", emoji: "🍽️", color: "#FF6B35" },
  { id: "2", name: "Pizza", emoji: "🍕", color: "#FF6B35" },
  { id: "3", name: "Burgers", emoji: "🍔", color: "#FDCB6E" },
  { id: "4", name: "Sushi", emoji: "🍱", color: "#00B894" },
  { id: "5", name: "Tacos", emoji: "🌮", color: "#E17055" },
  { id: "6", name: "Ramen", emoji: "🍜", color: "#6C5CE7" },
  { id: "7", name: "Salads", emoji: "🥗", color: "#55EFC4" },
  { id: "8", name: "Desserts", emoji: "🍰", color: "#FD79A8" },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "Druk Pizza",
    category: "Pizza",
    rating: 4.8,
    reviews: 243,
    deliveryTime: "25–35 min",
    deliveryFee: 30,
    emoji: "🍕",
    bgColor: "#FFEBE4",
    description:
      "Authentic pizza baked in a wood-fired oven using fresh, imported ingredients.",
    tags: ["Pizza", "Popular"],
  },
  {
    id: "r2",
    name: "Burger Point",
    category: "Burgers",
    rating: 4.6,
    reviews: 187,
    deliveryTime: "20–30 min",
    deliveryFee: 25,
    emoji: "🍔",
    bgColor: "#FFF9E4",
    description:
      "Handcrafted smash burgers made with premium Angus beef and house-made sauces.",
    tags: ["Burgers", "Fast Food"],
  },
  {
    id: "r3",
    name: "Wednesday Sushi",
    category: "Sushi",
    rating: 4.9,
    reviews: 312,
    deliveryTime: "30–45 min",
    deliveryFee: 35,
    emoji: "🍱",
    bgColor: "#E4FFF4",
    description:
      "Authentic Japanese cuisine featuring ultra-fresh sushi rolls, sashimi and ramen.",
    tags: ["Sushi", "Healthy"],
  },
  {
    id: "r4",
    name: "Taco Fiesta",
    category: "Tacos",
    rating: 4.5,
    reviews: 128,
    deliveryTime: "20–30 min",
    deliveryFee: 20,
    emoji: "🌮",
    bgColor: "#FFF0E4",
    description:
      "Authentic Mexican street tacos with marinated meats and fresh-made salsas.",
    tags: ["Tacos", "Spicy"],
  },
  {
    id: "r5",
    name: "Hayate Ramen",
    category: "Ramen",
    rating: 4.7,
    reviews: 201,
    deliveryTime: "30–40 min",
    deliveryFee: 30,
    emoji: "🍜",
    bgColor: "#F0E4FF",
    description:
      "House-made ramen broths with springy noodles and savory toppings.",
    tags: ["Ramen", "Vegetarian Options"],
  },
];

export const FOOD_ITEMS: FoodItem[] = [
  // ── Pizza ────────────────────────────────────────────────────────────────
  {
    id: "f1",
    restaurantId: "r1",
    name: "Margherita Pizza",
    price: 400,
    category: "Pizza",
    emoji: "🍕",
    rating: 4.9,
    reviews: 89,
    description:
      "Classic tomato sauce, fresh mozzarella di bufala and fragrant basil on hand-tossed dough.",
    calories: 850,
    prepTime: "15–20 min",
    tags: ["Bestseller", "Vegetarian"],
    bgColor: "#FFEBE4",
  },
  {
    id: "f2",
    restaurantId: "r1",
    name: "Pepperoni Pizza",
    price: 450,
    category: "Pizza",
    emoji: "🍕",
    rating: 4.8,
    reviews: 112,
    description:
      "Loaded with premium pepperoni, stretchy mozzarella and tangy San Marzano tomato sauce.",
    calories: 980,
    prepTime: "15–20 min",
    tags: ["Popular", "Meaty"],
    bgColor: "#FFEBE4",
  },
  // ── Burgers ──────────────────────────────────────────────────────────────
  {
    id: "f3",
    restaurantId: "r2",
    name: "Classic Cheeseburger",
    price: 190,
    category: "Burgers",
    emoji: "🍔",
    rating: 4.7,
    reviews: 76,
    description:
      "Angus beef patty, aged cheddar, crisp lettuce, tomato and house secret sauce in a brioche bun.",
    calories: 720,
    prepTime: "10–15 min",
    tags: ["Classic", "Popular"],
    bgColor: "#FFF9E4",
  },
  {
    id: "f4",
    restaurantId: "r2",
    name: "BBQ Bacon Burger",
    price: 280,
    category: "Burgers",
    emoji: "🍔",
    rating: 4.8,
    reviews: 94,
    description:
      "Double smash patty, crispy streaky bacon, smoky BBQ sauce and caramelised onions.",
    calories: 1050,
    prepTime: "12–18 min",
    tags: ["Bestseller", "Indulgent"],
    bgColor: "#FFF9E4",
  },
  // ── Sushi ────────────────────────────────────────────────────────────────
  {
    id: "f5",
    restaurantId: "r3",
    name: "Salmon Roll (8 pcs)",
    price: 260,
    category: "Sushi",
    emoji: "🍣",
    rating: 4.9,
    reviews: 134,
    description:
      "Fresh Atlantic salmon, creamy avocado and crisp cucumber rolled in seasoned sushi rice.",
    calories: 420,
    prepTime: "20–25 min",
    tags: ["Fresh", "Healthy"],
    bgColor: "#E4FFF4",
  },
  {
    id: "f6",
    restaurantId: "r3",
    name: "Dragon Roll (8 pcs)",
    price: 280,
    category: "Sushi",
    emoji: "🍱",
    rating: 4.9,
    reviews: 156,
    description:
      "Crispy shrimp tempura inside, topped with ripe avocado slices and sweet eel sauce.",
    calories: 580,
    prepTime: "25–30 min",
    tags: ["Special", "Popular"],
    bgColor: "#E4FFF4",
  },
  // ── Tacos ────────────────────────────────────────────────────────────────
  {
    id: "f7",
    restaurantId: "r4",
    name: "Street Tacos (3 pcs)",
    price: 250,
    category: "Tacos",
    emoji: "🌮",
    rating: 4.6,
    reviews: 68,
    description:
      "Corn tortillas filled with grilled carne asada, fresh white onion, cilantro and lime juice.",
    calories: 450,
    prepTime: "10–15 min",
    tags: ["Authentic", "Street Food"],
    bgColor: "#FFF0E4",
  },
  {
    id: "f8",
    restaurantId: "r4",
    name: "Spicy Chicken Taco",
    price: 180,
    category: "Tacos",
    emoji: "🌮",
    rating: 4.7,
    reviews: 81,
    description:
      "Slow-marinated spicy chicken, shredded cabbage, jalapeños and chipotle mayo.",
    calories: 490,
    prepTime: "12–18 min",
    tags: ["Spicy", "Popular"],
    bgColor: "#FFF0E4",
  },
  // ── Ramen ───────────────────────────────────────────────────────────────
  {
    id: "f9",
    restaurantId: "r5",
    name: "Shoyu Ramen",
    price: 180,
    category: "Ramen",
    emoji: "🍜",
    rating: 4.8,
    reviews: 98,
    description:
      "Rich shoyu broth with tender chashu, bamboo shoots and springy noodles.",
    calories: 680,
    prepTime: "20–25 min",
    tags: ["Classic", "House Special"],
    bgColor: "#F0E4FF",
  },
  {
    id: "f10",
    restaurantId: "r5",
    name: "Spicy Miso Ramen",
    price: 160,
    category: "Ramen",
    emoji: "🍜",
    rating: 4.6,
    reviews: 72,
    description:
      "Hearty miso broth with a kick of spice, corn, and spring onions.",
    calories: 580,
    prepTime: "18–22 min",
    tags: ["Spicy", "Popular"],
    bgColor: "#F0E4FF",
  },
];

// IDs shown in the "Featured" horizontal row on Home
export const FEATURED_IDS = ["f1", "f5", "f3", "f6", "f9"];
