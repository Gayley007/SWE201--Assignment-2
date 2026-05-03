
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";

// ── Mock user data ──────────────────────────────────────────────
const USER = {
  name: "Kezang Loday",
  email: "kezangLoday@gmail.com",
  avatar: "👤",
  memberSince: "March 2025",
  totalOrders: 24,
  totalSpent: 10480,
  points: 1240,
};

// ── Mock recent orders ──────────────────────────────────────────
const RECENT_ORDERS = [
  {
    id: "o1",
    items: "Margherita Pizza × 1",
    date: "Today, 12:30 PM",
    total: 400,
    status: "Delivered",
  },
  {
    id: "o2",
    items: "BBQ Bacon Burger × 2",
    date: "Yesterday, 7:15 PM",
    total: 280,
    status: "Delivered",
  },
  {
    id: "o3",
    items: "Dragon Roll × 1",
    date: "Apr 28, 6:45 PM",
    total: 180,
    status: "Delivered",
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  // Settings toggles
  const [notifications, setNotifications] = useState(true); // Enable/disable notifications
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle (not implemented)
  const [promos, setPromos] = useState(true); // Promotional emails toggle

  // ── Avatar tap animation: bounce effect for visual feedback ─────────────────────
  const avatarScale = useRef(new Animated.Value(1)).current;

  const handleAvatarPress = () => {
    Animated.sequence([
      Animated.spring(avatarScale, {
        toValue: 1.15,
        tension: 100,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Avatar card ────────────────────────────────────────────────── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.9}>
            <Animated.View
              style={[styles.avatar, { transform: [{ scale: avatarScale }] }]}
            >
              <Text style={styles.avatarEmoji}>{USER.avatar}</Text>
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.userName}>{USER.name}</Text>
          <Text style={styles.userEmail}>{USER.email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>
              🏆 Member since {USER.memberSince}
            </Text>
          </View>
        </View>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{USER.totalOrders}</Text>
            <Text style={styles.statLbl}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>Nu {USER.totalSpent.toFixed(0)}</Text>
            <Text style={styles.statLbl}>Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{USER.points}</Text>
            <Text style={styles.statLbl}>Points</Text>
          </View>
        </View>

        {/* ── Recent orders ──────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {RECENT_ORDERS.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderLeft}>
              <Text style={styles.orderItems}>{order.items}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderTotal}>Nu {order.total.toFixed(2)}</Text>
              <View style={styles.orderStatusBadge}>
                <Text style={styles.orderStatusText}>{order.status}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* ── Settings ───────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {[
            {
              icon: "notifications-outline" as const,
              label: "Push Notifications",
              value: notifications,
              onToggle: setNotifications,
            },
            {
              icon: "moon-outline" as const,
              label: "Dark Mode",
              value: darkMode,
              onToggle: setDarkMode,
            },
            {
              icon: "pricetag-outline" as const,
              label: "Promotional Emails",
              value: promos,
              onToggle: setPromos,
            },
          ].map((setting, idx, arr) => (
            <View
              key={setting.label}
              style={[
                styles.settingRow,
                idx < arr.length - 1 && styles.settingBorder,
              ]}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconBox}>
                  <Ionicons name={setting.icon} size={20} color="#FF6B35" />
                </View>
                <Text style={styles.settingLabel}>{setting.label}</Text>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onToggle}
                trackColor={{ false: "#DFE6E9", true: "#FF6B35" }}
                thumbColor="#FFF"
              />
            </View>
          ))}
        </View>

        {/* ── Account actions ────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsCard}>
          {[
            {
              icon: "person-outline" as const,
              label: "Edit Profile",
              color: "#2D3436",
            },
            {
              icon: "card-outline" as const,
              label: "Payment Methods",
              color: "#2D3436",
            },
            {
              icon: "location-outline" as const,
              label: "Delivery Addresses",
              color: "#2D3436",
            },
            {
              icon: "help-circle-outline" as const,
              label: "Help & Support",
              color: "#2D3436",
            },
            {
              icon: "log-out-outline" as const,
              label: "Log Out",
              color: "#D63031",
            },
          ].map((action, idx, arr) => (
            <TouchableOpacity
              key={action.label}
              style={[
                styles.settingRow,
                idx < arr.length - 1 && styles.settingBorder,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconBox,
                    action.color === "#D63031" && {
                      backgroundColor: "#FFF0F0",
                    },
                  ]}
                >
                  <Ionicons name={action.icon} size={20} color={action.color} />
                </View>
                <Text style={[styles.settingLabel, { color: action.color }]}>
                  {action.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>QuickBite v1.0.0</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
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

  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FF6B35",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarEmoji: { fontSize: 42 },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3436",
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: "#636E72", marginBottom: 12 },
  memberBadge: {
    backgroundColor: "#FFF3CD",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  memberText: { fontSize: 13, color: "#6C4C00", fontWeight: "600" },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FF6B35",
    marginBottom: 2,
  },
  statLbl: { fontSize: 12, color: "#636E72" },
  statDivider: { width: 1, backgroundColor: "#DFE6E9" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  orderLeft: { flex: 1 },
  orderItems: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  orderDate: { fontSize: 12, color: "#636E72" },
  orderRight: { alignItems: "flex-end", gap: 6 },
  orderTotal: { fontSize: 15, fontWeight: "800", color: "#2D3436" },
  orderStatusBadge: {
    backgroundColor: "#E8FFF5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  orderStatusText: { fontSize: 11, color: "#00B894", fontWeight: "600" },

  settingsCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF0EB",
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: { fontSize: 15, color: "#2D3436", fontWeight: "500" },

  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#B2BEC3",
    marginBottom: 8,
  },
});
