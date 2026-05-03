
import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import DetailScreen from "../screens/DetailScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AnimationDemoScreen from "../screens/AnimationDemoScreen";
import { useCart } from "../context/CartContext";

// ─────────────────────────── Navigator instances ───────────────────────────
const HomeStack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// ── Home stack: Home → Detail ───────────────────────────────────────────────
function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
    </HomeStack.Navigator>
  );
}

// ── Menu stack: Category → Detail ──────────────────────────────────────────
function MenuStackNav() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="Category" component={CategoryScreen} />
      <MenuStack.Screen name="Detail" component={DetailScreen} />
    </MenuStack.Navigator>
  );
}

// ── Bottom Tab Navigator ────────────────────────────────────────────────────
function TabNavigator() {
  const { itemCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#B2BEC3",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#DFE6E9",
          height: 62,
          marginBottom: 8,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            HomeTab: ["home", "home-outline"],
            MenuTab: ["restaurant", "restaurant-outline"],
            CartTab: ["cart", "cart-outline"],
            ProfileTab: ["person", "person-outline"],
          };
          const [filled, outline] = icons[route.name] ?? [
            "help",
            "help-outline",
          ];
          return (
            <Ionicons
              name={(focused ? filled : outline) as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNav}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="MenuTab"
        component={MenuStackNav}
        options={{ tabBarLabel: "Menu" }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: "Cart",
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: "#FF6B35", fontSize: 11 },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}

// ── Custom Drawer content label ─────────────────────────────────────────────
function DrawerLabel({ label, emoji }: { label: string; emoji: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={{ fontSize: 15, fontWeight: "600", color: "#2D3436" }}>
        {label}
      </Text>
    </View>
  );
}

// ── Root Drawer Navigator ───────────────────────────────────────────────────
function RootDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#FF6B35",
        drawerInactiveTintColor: "#636E72",
        drawerStyle: { backgroundColor: "#FFFFFF", width: 280 },
        drawerLabelStyle: { fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="MainApp"
        component={TabNavigator}
        options={{ drawerLabel: () => <DrawerLabel label="Home" emoji="🏠" /> }}
      />
      <Drawer.Screen
        name="AnimationDemo"
        component={AnimationDemoScreen}
        options={{
          drawerLabel: () => <DrawerLabel label="Animation Demo" emoji="✨" />,
          headerShown: true,
          title: "Animation Demo",
          headerStyle: { backgroundColor: "#FF6B35" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />
    </Drawer.Navigator>
  );
}

// ── Public export ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootDrawer />
    </NavigationContainer>
  );
}
