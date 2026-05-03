import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { CATEGORIES, FOOD_ITEMS } from "../data/mockData";
import FoodCard from "../components/FoodCard";

const { width } = Dimensions.get("window");
// ── Skip the "All" entry for the tab bar; we handle it separately ────────────────
const MENU_CATS = CATEGORIES.slice(1);

export default function CategoryScreen() {
  const navigation = useNavigation<any>();

  // ── State for tracking active category and tab positions ────────────────────────
  const [activeCat, setActiveCat] = useState(MENU_CATS[0].name); // Current selected category
  const [indicatorX, setIndicatorX] = useState(0); // X position of active tab indicator
  const [tabWidths, setTabWidths] = useState<Record<string, number>>({}); // Width of each tab

  // ── Animations for smooth category transition ─────────────────────────────────
  const slideAnim = useRef(new Animated.Value(0)).current; // Slide content when category changes
  const fadeAnim = useRef(new Animated.Value(1)).current; // Fade content when category changes

  // ── Handle category tab press: animate out, switch category, animate in ───────────────
  const handleCatPress = useCallback(
    (name: string, x: number) => {
      if (name === activeCat) return; // Already selected

      // Slide old content out and fade
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Switch to new category
        setActiveCat(name);
        setIndicatorX(x);
        // Reset and animate new content in
        slideAnim.setValue(20);
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [activeCat, slideAnim, fadeAnim],
  );

  // ── Filter items by currently selected category ───────────────────────────────
  const filteredItems = FOOD_ITEMS.filter((i) => i.category === activeCat);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header with menu icon and title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.iconBtn}
        >
          <Ionicons name="menu" size={28} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Category tabs ───────────────────────────────────────────────── */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {MENU_CATS.map((cat) => {
            const isActive = cat.name === activeCat;
            return (
              <TouchableOpacity
                key={cat.id}
                onLayout={(e) => {
                  const { x, width: w } = e.nativeEvent.layout;
                  setTabWidths((prev) => ({ ...prev, [cat.name]: w }));
                  if (cat.name === activeCat) setIndicatorX(x);
                }}
                onPress={() => {
                  const x = Object.entries(tabWidths)
                    .slice(
                      0,
                      MENU_CATS.findIndex((c) => c.name === cat.name),
                    )
                    .reduce((acc, [, w]) => acc + w + 8, 0);
                  handleCatPress(cat.name, x);
                }}
                style={styles.tabItem}
              >
                <Text style={styles.tabEmoji}>{cat.emoji}</Text>
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sliding underline indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              left: indicatorX + 8,
              width: tabWidths[activeCat] ? tabWidths[activeCat] - 16 : 60,
            },
          ]}
        />
      </View>

      {/* ── Food items (animated on category switch) ────────────────────── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}
        contentContainerStyle={styles.listContent}
      >
        <Text style={styles.countText}>
          {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
        </Text>

        {filteredItems.map((item, idx) => (
          <FoodCard
            key={item.id}
            item={item}
            delay={idx * 60}
            onPress={() => navigation.navigate("Detail", { item })}
          />
        ))}

        <View style={{ height: 24 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#2D3436" },

  tabsContainer: { borderBottomWidth: 1, borderBottomColor: "#DFE6E9" },
  tabsRow: { paddingHorizontal: 12, gap: 8, paddingBottom: 12 },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabEmoji: { fontSize: 16 },
  tabLabel: { fontSize: 14, fontWeight: "500", color: "#636E72" },
  tabLabelActive: { color: "#FF6B35", fontWeight: "700" },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: "#FF6B35",
    borderRadius: 3,
  },

  listContent: { paddingTop: 16 },
  countText: {
    fontSize: 13,
    color: "#636E72",
    marginHorizontal: 20,
    marginBottom: 12,
  },
});
