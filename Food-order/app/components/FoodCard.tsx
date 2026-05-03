import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FoodItem } from "../data/mockData";

interface Props {
  item: FoodItem; // The food item data to display
  onPress: () => void; // Callback when card is tapped
  horizontal?: boolean; // true = horizontal card in scroll row; false = vertical card
  delay?: number; // Stagger delay in ms for entrance animation (for lists)
}

export default function FoodCard({
  item,
  onPress,
  horizontal = false,
  delay = 0,
}: Props) {
  // Animation values for entrance effect and press interaction
  const fadeAnim = useRef(new Animated.Value(0)).current; // Starts invisible
  const slideAnim = useRef(new Animated.Value(20)).current; // Starts 20px lower
  const scaleAnim = useRef(new Animated.Value(1)).current; // Scales on press

  // ── Entrance animation: fade in + slide up with staggered delay ──────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  // ── Press animations: scale down when pressed, bounce back when released ────
  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.96, // Shrink to 96% when user presses
      useNativeDriver: true,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1, // Bounce back to 100%
      friction: 4,
      useNativeDriver: true,
    }).start();

  const cardStyle = horizontal ? styles.cardH : styles.cardV;

  return (
    <Animated.View
      style={[
        cardStyle,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={horizontal ? styles.innerH : styles.innerV}
      >
        {/* Top section: emoji icon with background color and tag badge */}
        <View style={[styles.emojiBox, { backgroundColor: item.bgColor }]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          {item.tags[0] && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.tags[0]}</Text>
            </View>
          )}
        </View>

        {/* Middle/Bottom section: name, description, price */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.price}>Nu {item.price.toFixed(2)}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#FDCB6E" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const CARD_W = 180;

const styles = StyleSheet.create({
  // ── Horizontal variant (inside a horizontal ScrollView) ──
  cardH: {
    width: CARD_W,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  innerH: { flex: 1 },

  // ── Vertical variant (full-width list item) ──
  cardV: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  innerV: { flexDirection: "row", alignItems: "center" },

  emojiBox: {
    width: CARD_W, // full width for horizontal, fixed for vertical
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 52 },

  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },

  info: { padding: 12, flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: "#2D3436", marginBottom: 4 },
  desc: { fontSize: 12, color: "#636E72", lineHeight: 16, marginBottom: 8 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 16, fontWeight: "800", color: "#FF6B35" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  rating: { fontSize: 12, fontWeight: "600", color: "#2D3436" },
});
