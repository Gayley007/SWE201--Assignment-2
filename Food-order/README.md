# Food Order App – Project Report

## App Overview

**Food Order** is a modern, animated mobile application built with Expo and React Native that enables users to browse restaurants, explore food items, and manage a shopping cart. The app is localized for Bhutan with resonable prices  and features a curated selection of restaurants serving pizza, burgers, sushi, tacos, and ramen.

---

## Key Features

### 1. **Restaurant & Food Browsing**

- Browse featured restaurants on the home screen
- Filter restaurants by category (Pizza, Burgers, Sushi, Tacos, Ramen)
- Search for specific food items by name
- View detailed nutritional and preparation information for each item

### 2. **Shopping Cart Management**

- Add items to cart with custom quantity selection
- Swipe-left-to-delete gesture for removing items from cart
- Real-time cart total calculation with delivery fees
- Cart badge on the bottom navigation showing item count

### 3. **User Profile**

- View user profile with name (Kezang Loday), email, and membership info
- Track order history with status and totals
- Loyalty points and spending statistics
- Notification and promotional email preferences

### 4. **Advanced UI/UX**

- Responsive grid layouts for food items
- Smooth animations and transitions throughout the app
- Dark and light mode support (framework ready)
- Accessible navigation with drawer menu and bottom tabs

### 5. **Restaurants Included**

- **Druk Pizza** – Wood-fired authentic pizza
- **Burger Point** – Handcrafted premium burgers
- **Wednesday Sushi** – Fresh Japanese cuisine
- **Taco Fiesta** – Authentic Mexican street tacos
- **Hayate Ramen** – House-made Japanese ramen broths

---

## Navigation Flow

```
RootNavigator (Drawer)
├── MainApp (Bottom Tab Navigator)
│   ├── HomeTab → HomeScreen (Stack)
│   │   ├── Home → Featured items, restaurants, search
│   │   └── Detail → Food item details & add to cart
│   ├── MenuTab → CategoryScreen (Stack)
│   │   ├── Category tabs (Pizza, Sushi, Burger, etc.)
│   │   └── Detail → Food item details
│   ├── CartTab → CartScreen
│   │   └── Swipeable cart items, checkout summary
│   └── ProfileTab → ProfileScreen
│       └── User profile, order history, settings
└── AnimationDemo (Drawer only)
    └── AnimationDemoScreen → Showcases app animations
```

### Screen Hierarchy

- **HomeScreen**: Entry point with featured carousel, category filter pills, search bar
- **CategoryScreen**: Dedicated menu browser with horizontal category tabs and animated transitions
- **DetailScreen**: Food item detail view with hero emoji, description, quantity selector, and add-to-cart button
- **CartScreen**: Shopping cart with swipeable rows, subtotal/delivery/total summary, and checkout action
- **ProfileScreen**: User account, order history, loyalty points, and app settings
- **AnimationDemoScreen**: Showcase of all animations used in the app (drawer-only access)

---

## Animations & Transitions

### 1. **Screen Entrance Animations**

- **HomeScreen**: Fade-in + slide-up (1000ms) with banner bounce
- **DetailScreen**: Hero emoji bounces in + content slides up with staggered timing (600ms each)
- **CategoryScreen**: Content fades and slides when switching categories (300ms out, 400ms in)

### 2. **Component-Level Animations**

- **FoodCard**: Staggered fade-in + slide-up entrance (800ms), scale on press (0.93x)
- **CategoryCard**: Selection state animates background color & scale growth (spring-based)
- **AnimatedButton**: Press bounce effect (scales down 0.93x then bounces back)
- **SwipeableRow** (Cart): Left-swipe triggers slide-out + fade (250ms) with delete hint reveal

### 3. **Micro-Interactions**

- **Search bar pulse**: Subtle scale animation on focus/blur
- **Avatar bounce**: Profile avatar bounces when tapped (spring animation)
- **Quantity badge**: Bounces when quantity changes in detail screen
- **Cart item transitions**: Smooth animations for add/remove/update operations

### 4. **Timing & Smoothness**

- All slide animations now use **extended durations** (400–1000ms) for a slower, more deliberate feel
- Spring animations use **tension/friction** values for natural bounce effects
- Parallel animations for multi-property changes (fade + slide simultaneously)
- Staggered delays for list items to create cascading entrance effects

---

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack, Tab, Drawer)
- **State Management**: Context API with useReducer (CartContext)
- **Animations**: React Native Animated API (native driver optimization)
- **Styling**: StyleSheet (React Native native styles)
- **Icons**: Expo Vector Icons (Ionicons)

---

## Getting Started

### Installation

```bash
npm install
```

### Run the App

```bash
npx expo start
```

Open in:

- **Expo Go** (quick preview)
- **iOS Simulator** or **Android Emulator**
- **Development Build**

---

## Project Structure

```
app/
├── components/
│   ├── AnimatedButton.tsx       # Spring-bounce button
│   ├── FoodCard.tsx             # Reusable food item card
│   ├── CategoryCard.tsx         # Category pill/tab
├── screens/
│   ├── HomeScreen.tsx           # Featured & restaurant list
│   ├── CategoryScreen.tsx       # Menu browser by category
│   ├── DetailScreen.tsx         # Food item detail & add to cart
│   ├── CartScreen.tsx           # Shopping cart with swipe
│   ├── ProfileScreen.tsx        # User profile & orders
│   ├── AnimationDemoScreen.tsx  # Animation showcase
├── context/
│   └── CartContext.tsx          # Global cart state (reducer)
├── navigation/
│   └── AppNavigator.tsx         # Root navigation structure
├── data/
│   └── mockData.ts              # Restaurants, categories, food items
```

---

## Future Enhancements

- Backend API integration (remove mock data)
- Real payment gateway integration
- Order tracking in real-time
- Dark mode full implementation
- Favorites/saved items
- Ratings and reviews submission
- Multi-language support
- Push notifications for orders

---