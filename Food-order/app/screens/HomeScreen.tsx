import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  StatusBar,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import {
  CATEGORIES,
  RESTAURANTS,
  FOOD_ITEMS,
  FEATURED_IDS,
} from "../data/mockData";
import FoodCard from "../components/FoodCard";
import CategoryCard from "../components/CategoryCard";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { itemCount } = useCart();

  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState(""); // User's search text
  const [selectedCategory, setSelectedCategory] = useState("All"); // Currently selected category filter

  // ── Animation values for screen entrance and interactions ────────────────────
  const screenFade = useRef(new Animated.Value(0)).current; // Fade in entire screen
  const screenSlide = useRef(new Animated.Value(30)).current; // Slide up from bottom
  const searchScale = useRef(new Animated.Value(1)).current; // Search bar pulse on focus
  const bannerScale = useRef(new Animated.Value(0.95)).current; // Featured banner bounce

  useEffect(() => {
    // Fade + slide-up the whole screen on mount
    Animated.parallel([
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(screenSlide, {
        toValue: 0,
        tension: 40,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle bounce on the banner
    Animated.spring(bannerScale, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, []);

  const onSearchFocus = () =>
    Animated.spring(searchScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();

  const onSearchBlur = () =>
    Animated.spring(searchScale, { toValue: 1, useNativeDriver: true }).start();

  // ── Filter featured items for the carousel at the top ────────────────────────
  const featuredItems = FOOD_ITEMS.filter((i) => FEATURED_IDS.includes(i.id));

  const filteredRestaurants =
    selectedCategory === "All"
      ? RESTAURANTS
      : RESTAURANTS.filter((r) => r.category === selectedCategory);

  const filteredBySearch = filteredRestaurants.filter(
    (r) =>
      searchQuery.length === 0 ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <Animated.View
        style={[
          styles.screen,
          { opacity: screenFade, transform: [{ translateY: screenSlide }] },
        ]}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.iconBtn}
          >
            <Ionicons name="menu" size={28} color="#2D3436" />
          </TouchableOpacity>

          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.headerTitle}>What shall we eat?</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("CartTab")}
            style={styles.iconBtn}
          >
            <Ionicons name="cart-outline" size={26} color="#2D3436" />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Search bar ─────────────────────────────────────────────────── */}
        <Animated.View
          style={[styles.searchWrap, { transform: [{ scale: searchScale }] }]}
        >
          <Ionicons name="search" size={20} color="#636E72" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search food or restaurant…"
            placeholderTextColor="#B2BEC3"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#B2BEC3" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Scrollable body ────────────────────────────────────────────── */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Promo Banner */}
          <Animated.View
            style={[styles.banner, { transform: [{ scale: bannerScale }] }]}
          >
            <View style={styles.bannerLeft}>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>🔥 Today's Special</Text>
              </View>
              <Text style={styles.bannerTitle}>
                Get 20% off{"\n"}your first order!
              </Text>
              <TouchableOpacity
                style={styles.bannerBtn}
                onPress={() => navigation.navigate("MenuTab")}
              >
                <Text style={styles.bannerBtnText}>Order Now →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bannerEmoji}>🍕</Text>
          </Animated.View>

          {/* Categories */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.name}
                onPress={() => setSelectedCategory(cat.name)}
              />
            ))}
          </ScrollView>

          {/* Featured dishes */}
          <Text style={styles.sectionTitle}>Featured Dishes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredRow}
          >
            {featuredItems.map((item, idx) => (
              <FoodCard
                key={item.id}
                item={item}
                horizontal
                delay={idx * 80}
                onPress={() => navigation.navigate("Detail", { item })}
              />
            ))}
          </ScrollView>

          {/* Restaurant list */}
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All"
              ? "All Restaurants"
              : `${selectedCategory} Places`}
          </Text>

          {filteredBySearch.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>
                No results for "{searchQuery}"
              </Text>
            </View>
          ) : (
            filteredBySearch.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={styles.restCard}
                onPress={() => navigation.navigate("MenuTab")}
                activeOpacity={0.85}
              >
                <View
                  style={[styles.restEmoji, { backgroundColor: r.bgColor }]}
                >
                  <Text style={styles.restEmojiText}>{r.emoji}</Text>
                </View>
                <View style={styles.restInfo}>
                  <Text style={styles.restName}>{r.name}</Text>
                  <Text style={styles.restTags}>{r.tags.join(" · ")}</Text>
                  <View style={styles.restMeta}>
                    <Ionicons name="star" size={13} color="#FDCB6E" />
                    <Text style={styles.restRating}>{r.rating}</Text>
                    <Text style={styles.dot}>·</Text>
                    <Text style={styles.restSub}>{r.deliveryTime}</Text>
                    <Text style={styles.dot}>·</Text>
                    <Text style={styles.restSub}>
                      Nu {r.deliveryFee.toFixed(2)} delivery
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>
            ))
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F9FA" },
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconBtn: { padding: 4, position: "relative" },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  greeting: { fontSize: 13, color: "#636E72" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#2D3436" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#2D3436" },

  banner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerLeft: { flex: 1 },
  bannerBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  bannerBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 14,
    lineHeight: 28,
  },
  bannerBtn: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
    alignSelf: "flex-start",
  },
  bannerBtnText: { color: "#FF6B35", fontWeight: "700", fontSize: 14 },
  bannerEmoji: { fontSize: 64 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoryRow: { paddingHorizontal: 20, gap: 10, marginBottom: 24 },
  featuredRow: { paddingHorizontal: 20, gap: 12, paddingBottom: 24 },

  restCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  restEmoji: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  restEmojiText: { fontSize: 28 },
  restInfo: { flex: 1 },
  restName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 2,
  },
  restTags: { fontSize: 12, color: "#636E72", marginBottom: 6 },
  restMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  restRating: { fontSize: 13, fontWeight: "600", color: "#2D3436" },
  dot: { fontSize: 12, color: "#B2BEC3" },
  restSub: { fontSize: 12, color: "#636E72" },

  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 15, color: "#636E72" },
});
