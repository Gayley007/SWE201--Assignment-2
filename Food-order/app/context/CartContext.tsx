
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// ── CartItem: represents a single food item in the cart with quantity ────────
export interface CartItem {
  id: string; // Unique identifier
  name: string; // Food name
  price: number; // Price per unit
  emoji: string; // Food emoji icon
  quantity: number; // How many in the cart
  restaurantId: string; // Which restaurant this item is from
}

// ── CartState: the current state of the shopping cart ──────────────────────
interface CartState {
  items: CartItem[]; // Array of items in cart
  total: number; // Total price of all items (price × quantity)
}

// ── CartAction: all possible actions that can modify the cart state ─────────
type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> } // Add new item or increase existing
  | { type: "REMOVE_ITEM"; id: string } // Remove item completely
  | { type: "INCREMENT"; id: string } // Increase quantity by 1
  | { type: "DECREMENT"; id: string } // Decrease quantity by 1 (remove if 0)
  | { type: "CLEAR_CART" }; // Empty entire cart

// ── Helper: recalculate total price based on items ────────────────────────
function recalc(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

// ── Reducer: handles all cart state changes ──────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    // Add new item, or if already exists, just increase quantity by 1
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.item.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...state.items, { ...action.item, quantity: 1 }];
      return { items, total: recalc(items) };
    }
    // Remove item completely from cart
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.id);
      return { items, total: recalc(items) };
    }
    // Increase quantity of item by 1
    case "INCREMENT": {
      const items = state.items.map((i) =>
        i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i,
      );
      return { items, total: recalc(items) };
    }
    // Decrease quantity by 1 (remove if quantity reaches 0)
    case "DECREMENT": {
      const items = state.items
        .map((i) =>
          i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0);
      return { items, total: recalc(items) };
    }
    case "CLEAR_CART":
      return { items: [], total: 0 };
    default:
      return state;
  }
}

// ── CartContextType: the API exposed to components ──────────────────────────
interface CartContextType {
  state: CartState; // Current cart state
  addItem: (item: Omit<CartItem, "quantity">) => void; // Add item to cart
  removeItem: (id: string) => void; // Delete item from cart
  increment: (id: string) => void; // Increase item quantity
  decrement: (id: string) => void; // Decrease item quantity
  clearCart: () => void; // Empty entire cart
  itemCount: number; // Total number of items (for badge)
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ── CartProvider: wrap your app with this to provide cart context to all screens ─
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", id }),
        increment: (id) => dispatch({ type: "INCREMENT", id }),
        decrement: (id) => dispatch({ type: "DECREMENT", id }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        itemCount: state.items.reduce((sum, i) => sum + i.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── useCart: hook to access cart state and actions from any component ──────
export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
