import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    console.log("Register:", name, email, password);
    // connect to backend
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >

      <View className="bg-orange-50 items-center pt-16 pb-10 rounded-b-[50px]">
        <Image
          source={require("../../assets/images/loginpag.jpg")}
          style={{ width: 220, height: 220 }}
          contentFit="cover"
        />
        <Text className="text-gray-500 mt-6 text-base font-medium">
          Create Your Account
        </Text>
      </View>

      {/* Form Section */}
      <View className="px-6 pt-10 flex-1">

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">Full Name</Text>
          <TextInput
            className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email */}
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

        {/* Password */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">Password</Text>
          <TextInput
            className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
            placeholder="Create a password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Confirm Password</Text>
          <TextInput
            className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
            placeholder="Confirm your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className="bg-orange-500 rounded-2xl py-4 items-center shadow-md"
          onPress={handleRegister}
        >
          <Text className="text-white font-bold text-lg">Create Account</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View className="flex-row justify-center mt-6 mb-10">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/(auth)/sign-in">
            <Text className="text-orange-500 font-medium">Sign In</Text>
          </Link>
        </View>

      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
