
import React, { useRef } from "react";
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface Props {
  label: string; // Button text
  onPress: () => void; // Callback when pressed
  color?: string; // Background color (default: orange #FF6B35)
  textColor?: string; // Text color (default: white)
  style?: ViewStyle; // Additional View styles
  labelStyle?: TextStyle; // Additional Text styles
  disabled?: boolean; // Disable button (grays out)
}
export default function AnimatedButton({
  label,
  onPress,
  color = "#FF6B35",
  textColor = "#FFF",
  style,
  labelStyle,
  disabled = false,
}: Props) {
  // Animation value: shrinks when pressed, bounces back when released
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ── Press-in: scale down to 93% ───────────────────────────────────
  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();

  // ── Press-out: bounce back to 100% with snappy animation ───────────────
  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 4,
    }).start();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn} // Trigger scale-down on press
        onPressOut={handlePressOut} // Trigger bounce-back on release
        disabled={disabled}
        activeOpacity={1} // We control opacity via scale animation
        style={[
          styles.button,
          { backgroundColor: disabled ? "#B2BEC3" : color },
        ]}
      >
        <Text style={[styles.label, { color: textColor }, labelStyle]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 16, fontWeight: "700" },
});
