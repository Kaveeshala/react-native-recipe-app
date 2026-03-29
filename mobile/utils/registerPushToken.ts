import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { API_URL } from "@/constants/api";

export const registerPushToken = async (userId: number) => {
  // Only works on real device, not simulator
  if (!Device.isDevice) {
    console.log("Push notifications only work on real devices");
    return;
  }

  // Ask permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission denied");
    return;
  }

  // Get token
  const tokenData = await Notifications.getExpoPushTokenAsync();
  const push_token = tokenData.data;

  // Save to backend
  await fetch(`${API_URL}/api/auth/push-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, push_token }),
  });

  // Android channel required
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  console.log("Push token registered:", push_token);
};
