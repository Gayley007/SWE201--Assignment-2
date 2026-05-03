
import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Text, Animated, StyleSheet } from "react-native";
import { Category } from "../data/mockData";

interface Props {
  category: Category; // Category data (name, emoji, color)
  isSelected: boolean; // Whether this category is currently selected
  onPress: () => void; // Callback when tapped
}

export default function CategoryCard({ category, isSelected, onPress }: Props) {
  // Animation values for selection state
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1.05 : 1)).current; // Grows when selected
  const backgroundAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current; // Background color transition

  // ── Handle selection state changes with smooth animations ─────────────────────
  useEffect(() => {
    // Note: Both animations use JS driver because backgroundColor interpolation requires it.
    // When we animate the same node with multiple properties, all must use same driver.
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.08 : 1,
      friction: 5,
      tension: 80,
      useNativeDriver: false,
    }).start();
    Animated.timing(backgroundAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  // ── Color interpolations: background changes to category color when selected ──
  const bgColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F8F9FA", category.color], // Light gray → category color
  });

  // Text color changes to white when selected for contrast
  const textColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#636E72", "#FFFFFF"], // Dark gray → white
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={styles.inner}
        activeOpacity={0.85}
      >
        <Text style={styles.emoji}>{category.emoji}</Text>
        <Animated.Text style={[styles.label, { color: textColor }]}>
          {category.name}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  inner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emoji: { fontSize: 18 },
  label: { fontSize: 14, fontWeight: "600" },
});
