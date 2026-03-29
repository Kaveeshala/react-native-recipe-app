import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";

// Unread badge
const Badge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <View
      style={{
        position: "absolute", top: -4, right: -8,
        backgroundColor: "#ef4444", borderRadius: 10,
        minWidth: 18, height: 18,
        alignItems: "center", justifyContent: "center",
        paddingHorizontal: 3,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
        {count > 99 ? "99+" : count}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) return;

      const res = await fetch(`${API_URL}/api/notifications/${user.id}`);
      const data = await res.json();
      const unread = data.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    } catch {
      console.log("Failed to fetch notification count");
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#f3f4f6",
          paddingBottom: 8,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="notifications-outline" size={size} color={color} />
              <Badge count={unreadCount} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => setUnreadCount(0),
        }}
      />
    </Tabs>
  );
}
