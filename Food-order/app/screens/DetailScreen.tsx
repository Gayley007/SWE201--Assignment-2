import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FoodItem } from "../data/mockData";
import { useCart } from "../context/CartContext";
import AnimatedButton from "../components/AnimatedButton";

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const item: FoodItem = route.params?.item; // Food item passed from previous screen

  const { addItem, state } = useCart();

  const [quantity, setQuantity] = useState(1); // Quantity selected by user

  // ── Animation values for entrance: hero bounces in, content slides up ────────────
  const heroScale = useRef(new Animated.Value(0.7)).current; // Emoji starts small
  const heroOpacity = useRef(new Animated.Value(0)).current; // Emoji starts invisible
  const contentSlide = useRef(new Animated.Value(40)).current; // Content starts 40px down
  const contentFade = useRef(new Animated.Value(0)).current; // Content starts invisible
  const qtyScale = useRef(new Animated.Value(1)).current; // Qty badge bounces
  const addedAnim = useRef(new Animated.Value(0)).current; // "Added to cart" feedback

  useEffect(() => {
    // Hero bounces in, content slides up
    Animated.sequence([
      Animated.parallel([
        Animated.spring(heroScale, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(contentSlide, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // ── Bounce qty badge when quantity changes ───────────────────────────────
  const animateQty = () => {
    Animated.sequence([
      Animated.spring(qtyScale, {
        toValue: 1.3,
        tension: 100,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(qtyScale, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const increment = () => {
    setQuantity((q) => q + 1);
    animateQty();
  };
  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      animateQty();
    }
  };

  // "Added!" flash animation
  const flashAdded = () => {
    Animated.sequence([
      Animated.timing(addedAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(700),
      Animated.timing(addedAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        emoji: item.emoji,
        restaurantId: item.restaurantId,
      });
    }
    flashAdded();
  };

  const cartCount = state.items.find((i) => i.id === item?.id)?.quantity ?? 0;

  if (!item) return null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#2D3436" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.hero,
            {
              backgroundColor: item.bgColor,
              transform: [{ scale: heroScale }],
              opacity: heroOpacity,
            },
          ]}
        >
          <Text style={styles.heroEmoji}>{item.emoji}</Text>
          {item.tags[0] && (
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{item.tags[0]}</Text>
            </View>
          )}
        </Animated.View>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.content,
            { opacity: contentFade, transform: [{ translateY: contentSlide }] },
          ]}
        >
          {/* Name + rating row */}
          <View style={styles.titleRow}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FDCB6E" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          <Text style={styles.reviews}>{item.reviews} reviews</Text>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statVal}>{item.calories}</Text>
              <Text style={styles.statLbl}>calories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>⏱️</Text>
              <Text style={styles.statVal}>{item.prepTime}</Text>
              <Text style={styles.statLbl}>prep time</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>💰</Text>
              <Text style={styles.statVal}>Nu {item.price.toFixed(2)}</Text>
              <Text style={styles.statLbl}>per item</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.desc}>{item.description}</Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Quantity selector */}
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={decrement}>
              <Ionicons
                name="remove"
                size={20}
                color={quantity === 1 ? "#B2BEC3" : "#FF6B35"}
              />
            </TouchableOpacity>
            <Animated.Text
              style={[styles.qtyValue, { transform: [{ scale: qtyScale }] }]}
            >
              {quantity}
            </Animated.Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={increment}>
              <Ionicons name="add" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>

          {/* Price summary */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceTotal}>
              Nu {(item.price * quantity).toFixed(2)}
            </Text>
          </View>

          {/* Add to cart */}
          <AnimatedButton
            label={`Add ${quantity > 1 ? `× ${quantity}` : ""} to Cart`}
            onPress={handleAddToCart}
            style={styles.addBtn}
          />

          {/* "Added!" feedback overlay */}
          <Animated.View
            pointerEvents="none"
            style={[styles.addedFeedback, { opacity: addedAnim }]}
          >
            <Text style={styles.addedText}>✓ Added to Cart!</Text>
          </Animated.View>

          {cartCount > 0 && (
            <TouchableOpacity
              style={styles.viewCartBtn}
              onPress={() => navigation.navigate("CartTab")}
            >
              <Text style={styles.viewCartText}>
                View Cart ({cartCount} items)
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F9FA" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  hero: {
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroEmoji: { fontSize: 100 },
  heroBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

  content: {
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 24,
    paddingTop: 28,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D3436",
    flex: 1,
    marginRight: 12,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF3CD",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ratingText: { fontSize: 14, fontWeight: "700", color: "#2D3436" },
  reviews: { fontSize: 13, color: "#636E72", marginBottom: 20 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statBox: { flex: 1, alignItems: "center", gap: 4 },
  statEmoji: { fontSize: 20 },
  statVal: { fontSize: 14, fontWeight: "700", color: "#2D3436" },
  statLbl: { fontSize: 11, color: "#636E72" },
  statDivider: { width: 1, backgroundColor: "#DFE6E9", marginHorizontal: 8 },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 8,
  },
  desc: { fontSize: 14, color: "#636E72", lineHeight: 22, marginBottom: 16 },
  tagsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 24 },
  tag: {
    backgroundColor: "#FFF0EB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: { color: "#FF6B35", fontSize: 13, fontWeight: "600" },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  qtyBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  qtyValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D3436",
    minWidth: 30,
    textAlign: "center",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  priceLabel: { fontSize: 16, color: "#636E72", fontWeight: "600" },
  priceTotal: { fontSize: 26, fontWeight: "800", color: "#FF6B35" },

  addBtn: { marginBottom: 12 },

  addedFeedback: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "#00B894",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addedText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  viewCartBtn: {
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  viewCartText: { color: "#FF6B35", fontSize: 15, fontWeight: "700" },
});
