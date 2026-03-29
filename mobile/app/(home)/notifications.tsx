import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator, FlatList, Text,
  TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";

type Notification = {
  id: number;
  recipe_id: number;
  commenter_name: string;
  recipe_title: string;
  is_read: boolean;
  created_at: string;
};

const NotificationItem = ({
  item, onPress,
}: {
  item: Notification;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-start p-4 mb-2 rounded-2xl border ${
      item.is_read ? "bg-white border-gray-100" : "bg-orange-50 border-orange-100"
    }`}
  >
    

    {/* Text */}
    <View className="flex-1">
      <Text className="text-gray-800 text-sm font-medium leading-5">
        <Text className="font-bold">{item.commenter_name}</Text>
        {" commented on your recipe "}
        <Text className="font-bold">"{item.recipe_title}"</Text>
      </Text>
      <Text className="text-gray-400 text-xs mt-1">
        {new Date(item.created_at).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        })}
      </Text>
    </View>

    {/* Unread dot */}
    {!item.is_read && (
      <View className="w-2 h-2 rounded-full bg-orange-500 mt-2 ml-2" />
    )}
  </TouchableOpacity>
);

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAndMarkRead = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) return;

      // Fetch notifications
      const res = await fetch(`${API_URL}/api/notifications/${user.id}`);
      const data = await res.json();
      setNotifications(data);

      // Mark all as read
      await fetch(`${API_URL}/api/notifications/${user.id}/read`, {
        method: "PUT",
      });
    } catch {
      console.log("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch every time screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchAndMarkRead();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-5 pt-4">

        {/* Header */}
        <Text className="text-gray-800 text-3xl font-bold mb-6">Notifications</Text>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-base">No notifications yet</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              When someone comments on your recipe, you'll see it here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <NotificationItem
                item={item}
                onPress={() => router.push(`/(recipes)/${item.recipe_id}`)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
