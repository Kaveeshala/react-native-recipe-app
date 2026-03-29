import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { API_URL } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerPushToken } from "../../utils/registerPushToken";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
        const test = await fetch(`http://192.168.0.196:5001`);
    console.log("Test fetch status:", test.status);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Login failed");
        return;
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // Isolate push token — don't let it break login
      try {
        await registerPushToken(data.user.id);
      } catch (pushError) {
        console.log("Push token registration failed:", pushError);
      }

      router.replace("/(home)/home");
    } catch (error) {
      // Show the real error instead of a generic message
      console.log("Full error:", JSON.stringify(error));
      console.log(
        "Error message:",
        error instanceof Error ? error.message : String(error),
      );
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        Alert.alert(
          "Network Error",
          `Cannot reach server at ${API_URL}. Make sure your backend is running.`,
        );
      } else {
        Alert.alert(
          "Error",
          error instanceof Error ? error.message : String(error),
        );
      }
      console.log("Login error details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className=" items-center pt-16 pb-10 rounded-b-[50px]">
        <View
          className="rounded-full overflow-hidden"
          style={{ width: 220, height: 220 }}
        >
          <Image
            source={require("../../assets/images/recipe_image.jpg")}
            style={{ width: 220, height: 220 }}
            contentFit="cover"
          />
        </View>
        <Text className="text-black mt-6 text-2xl font-medium">
          Welcome Back
        </Text>
      </View>

      <View className="px-6 pt-10 flex-1">
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">Email</Text>
          <TextInput
            className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-700 font-semibold mb-2">Password</Text>
          <TextInput
            className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity className="items-end mb-6">
          <Text className="text-orange-500 font-medium">Forgot Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-orange-500 rounded-2xl py-4 items-center"
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Don't have an account? </Text>
          <Link href="/(auth)/register">
            <Text className="text-orange-500 font-medium">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignInScreen;
