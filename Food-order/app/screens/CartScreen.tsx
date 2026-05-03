
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart, CartItem } from "../context/CartContext";
import AnimatedButton from "../components/AnimatedButton";

// ── SwipeableRow: individual cart item row with left-swipe-to-delete gesture ──
function SwipeableRow({
  item,
  onRemove,
  onIncrement,
  onDecrement,
}: {
  item: CartItem;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const rowOpacity = useRef(new Animated.Value(1)).current;

  // ── Gesture recognizer: detect left-swipe (minimum 80px) to trigger delete ────
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8, // Detect swipe
      onPanResponderMove: (_, g) => {
        // Only allow left-swipe (negative dx), ignore right-swipe
        if (g.dx < 0) translateX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < -80) {
          // Swipe was far enough: animate out and remove item
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -400,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(rowOpacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(onRemove);
        } else {
          // Not far enough: snap back to original position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[styles.swipeRow, { opacity: rowOpacity }]}
      {...panResponder.panHandlers}
    >
      {/* Red delete hint visible behind when swiped */}
      <View style={styles.deleteHint}>
        <Ionicons name="trash-outline" size={22} color="#FFF" />
        <Text style={styles.deleteHintText}>Remove</Text>
      </View>

      {/* Main row card that slides left on swipe */}
      <Animated.View style={[styles.rowCard, { transform: [{ translateX }] }]}>
        {/* Food emoji icon */}
        <View style={styles.rowEmoji}>
          <Text style={styles.rowEmojiText}>{item.emoji}</Text>
        </View>

        {/* Item name and unit price */}
        <View style={styles.rowInfo}>
          <Text style={styles.rowName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.rowPrice}>Nu {item.price.toFixed(2)} each</Text>
        </View>

        {/* Quantity controls: minus button, qty display, plus button */}
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrement}>
            <Ionicons name="remove" size={16} color="#FF6B35" />
          </TouchableOpacity>
          <Text style={styles.qtyVal}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrement}>
            <Ionicons name="add" size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Row total: unit price × quantity */}
        <Text style={styles.rowSubtotal}>
          Nu {(item.price * item.quantity).toFixed(2)}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ── Main CartScreen component ────────────────────────────────────────────────
export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { state, removeItem, increment, decrement, clearCart } = useCart();

  const [ordered, setOrdered] = useState(false);
  const successScale = useRef(new Animated.Value(0)).current;

  const delivery = state.items.length > 0 ? 2.99 : 0;
  const grandTotal = state.total + delivery;

  const handleCheckout = () => {
    // Bounce success popup
    Animated.spring(successScale, {
      toValue: 1,
      tension: 60,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setOrdered(true);
  };

  const handleContinue = () => {
    clearCart();
    setOrdered(false);
    successScale.setValue(0);
    navigation.navigate("HomeTab");
  };

  // ── Empty state ─────────────────────────────────────────────────────────
  if (state.items.length === 0 && !ordered) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious items to get started!
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate("MenuTab")}
          >
            <Text style={styles.browseBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (ordered) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Animated.View
            style={[
              styles.successCard,
              { transform: [{ scale: successScale }] },
            ]}
          >
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>Order Placed!</Text>
            <Text style={styles.successSubtitle}>
              Your food is being prepared and will arrive soon.
            </Text>
            <Text style={styles.successEta}>Estimated delivery: 30–45 min</Text>
            <AnimatedButton
              label="Continue Shopping"
              onPress={handleContinue}
              style={{ marginTop: 24 }}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Cart with items ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Clear cart?", "Remove all items?", [
              { text: "Cancel", style: "cancel" },
              { text: "Clear", style: "destructive", onPress: clearCart },
            ])
          }
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.swipeHint}>← Swipe left to remove</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {state.items.map((item) => (
          <SwipeableRow
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
            onIncrement={() => increment(item.id)}
            onDecrement={() => decrement(item.id)}
          />
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Summary ──────────────────────────────────────────────────────── */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>Nu {state.total.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery fee</Text>
          <Text style={styles.summaryValue}>Nu {delivery.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Nu {grandTotal.toFixed(2)}</Text>
        </View>
        <AnimatedButton
          label={`Checkout — Nu ${grandTotal.toFixed(2)}`}
          onPress={handleCheckout}
          style={{ marginTop: 16 }}
        />
      </View>
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
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#2D3436" },
  clearText: { fontSize: 14, color: "#D63031", fontWeight: "600" },
  swipeHint: {
    fontSize: 12,
    color: "#B2BEC3",
    marginHorizontal: 20,
    marginBottom: 8,
  },
  list: { flex: 1 },

  // Swipeable row
  swipeRow: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  deleteHint: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#D63031",
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  deleteHintText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 16,
    gap: 10,
  },
  rowEmoji: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },
  rowEmojiText: { fontSize: 26 },
  rowInfo: { flex: 1 },
  rowName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 2,
  },
  rowPrice: { fontSize: 12, color: "#636E72" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFF0EB",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyVal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D3436",
    minWidth: 20,
    textAlign: "center",
  },
  rowSubtotal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FF6B35",
    minWidth: 48,
    textAlign: "right",
  },

  // Summary
  summary: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: "#636E72" },
  summaryValue: { fontSize: 14, color: "#2D3436", fontWeight: "600" },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#DFE6E9",
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#2D3436" },
  totalValue: { fontSize: 20, fontWeight: "800", color: "#FF6B35" },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D3436",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: "#FF6B35",
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  browseBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  // Success state
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2D3436",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  successEta: { fontSize: 14, color: "#00B894", fontWeight: "600" },
});
