# SWE201 Assignment 2 · Food Ordering App

## App Idea

This is a polished, frontend-only food ordering application that simulates a real-world food delivery experience. Users can browse restaurant categories, explore detailed food menus, add items to a cart, and place mock orders, all with smooth animations and gesture interactions throughout.

---

## Navigation Flow

The app uses three nested navigation layers to satisfy all requirements:

```
DrawerNavigator              (swipe from left or menu button)
├── MainApp           →        BottomTabNavigator
│   ├── Home tab      →        StackNavigator
│   │   ├── HomeScreen          (browse + search)
│   │   └── DetailScreen        (food detail + add to cart)
│   ├── Menu tab      →        StackNavigator
│   │   ├── CategoryScreen      (filtered menu)
│   │   └── DetailScreen        (shared)
│   ├── Cart tab      →        CartScreen (swipe-to-delete + checkout)
│   └── Profile tab   →        ProfileScreen (settings + order history)
└── Animation Demo    →        AnimationDemoScreen (drawer-only route)
```

### Navigation type | Where used

**Stack** | Home to Detail, Menu to Detail
**Bottom Tab** | Home / Menu / Cart / Profile
**Drawer** | Side menu: Main App + Animation Demo

---

## Screens

### 1. Home Screen

- Animated fade-in + slide-up entrance on mount
- Animated search bar that scales on focus
- Promo banner with spring bounce
- Horizontal category filter with animated selection
- Featured dishes horizontal scroll (staggered FoodCard entrance)
- Live-filtered restaurant list

### 2. Category / Menu Screen

- Horizontal tab bar with animated slide indicator
- Content fades out, slides, and fades back in on category change
- Food items displayed using the shared `FoodCard` component
- Item count shown per category

### 3. Detail Screen

- Hero emoji bounces in with a spring-scale entrance
- Description card slides up after hero appears
- Animated quantity counter (spring bounce on +/−)
- "Added to Cart!" flash feedback (fade in/out)
- "View Cart" shortcut when items are already in cart

### 4. Cart Screen

- **Gesture interaction**: each row can be swiped left with `PanResponder`; a red delete hint is revealed behind the row, and past the 80 px threshold the item slides off screen and fades out
- Quantity controls per item
- Real-time subtotal + delivery fee summary
- Checkout triggers a spring-animated success card

### 5. Profile / Settings Screen

- Avatar has a spring-bounce tap animation
- Order statistics (orders / spent / points)
- Recent orders list
- Toggle switches for notifications, dark mode, and promotions
- Account action list

### 6. Animation Demo Screen

Dedicated showcase with five independently controlled demos:

| #   | Type           | API used                                           |
| --- | -------------- | -------------------------------------------------- |
| 1   | Fade In / Out  | `Animated.timing` with `opacity`                   |
| 2   | Slide          | `Animated.spring` with `translateX`                |
| 3   | Scale / Bounce | `Animated.sequence` + multiple springs             |
| 4   | Draggable ball | `PanResponder` + `Animated.ValueXY`                |
| 5   | Progress bar   | `Animated.timing` with width & color interpolation |

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

## Gesture Interactions

1. **Swipe-to-delete** (CartScreen) — `PanResponder` tracks horizontal drag on each cart item. Swiping past 80 px plays a slide-out + fade animation then removes the item from state.
2. **Drag gesture** (AnimationDemoScreen) — `PanResponder` + `Animated.ValueXY` lets the user freely drag a ball inside a bounded area. The ball scales up on grab and snaps back smoothly on release.

---

## Technical Details

- **Framework**: React Native + Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v7 (native-stack, bottom-tabs, drawer)
- **State management**: React Context API + `useReducer` (no Redux, no backend)
- **Animations**: Built-in `Animated` API + `PanResponder` (no Reanimated required)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **No backend, no API calls, no database** — all data is static mock data in `src/data/mockData.ts`

---

## Project Structure

```
Food-order/
├── App.tsx                          # Root: providers + AppNavigator
├── app/
│   ├── data/
│   │   └── mockData.ts
│   ├── context/
│   │   └── CartContext.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── components/
│   │   ├── FoodCard.tsx             # Reusable animated food card
│   │   ├── CategoryCard.tsx         # Reusable animated category pill
│   │   └── AnimatedButton.tsx       # Reusable spring-bounce button
│   └── screens/
│       ├── HomeScreen.tsx
│       ├── CategoryScreen.tsx
│       ├── DetailScreen.tsx
│       ├── CartScreen.tsx
│       ├── ProfileScreen.tsx
│       └── AnimationDemoScreen.tsx
```
