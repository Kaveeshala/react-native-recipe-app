import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { API_URL } from "@/constants/api";

export default function AddRecipeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to your photo library");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to your camera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleImagePicker = () => {
    Alert.alert("Add Photo", "Choose an option", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !cookingTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("cooking_time", cookingTime);

      if (image) {
        const filename = image.split("/").pop() || "recipe.jpg";
        const type = `image/${filename.split(".").pop()}`;
        formData.append("image", { uri: image, name: filename, type } as any);
      }

      const response = await fetch(`${API_URL}/api/recipes`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      Alert.alert("Success", "Recipe added successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center px-5 pt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">
            Add New Recipe
          </Text>
        </View>

        <View className="px-5">
          {/* Image Picker */}
          <TouchableOpacity
            onPress={handleImagePicker}
            className="bg-white border-2 border-dashed border-orange-300 rounded-2xl h-48 items-center justify-center mb-2 overflow-hidden"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <View className="items-center">
                <Text className="text-orange-400 font-medium mt-2">
                  Tap to add photo
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  Camera or Gallery
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Change Photo */}
          {image && (
            <TouchableOpacity
              onPress={handleImagePicker}
              className="items-center mb-5"
            >
              <Text className="text-orange-500 font-medium">Change Photo</Text>
            </TouchableOpacity>
          )}

          {!image && <View className="mb-5" />}

          {/* Recipe Name */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">
              Recipe Name
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
              placeholder="Enter recipe name"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">
              Description
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
              placeholder="Describe your recipe..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              style={{ minHeight: 100 }}
            />
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Category</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
              placeholder="e.g. Italian, Asian, Breakfast"
              placeholderTextColor="#9CA3AF"
              value={category}
              onChangeText={setCategory}
            />
          </View>

          {/* Cooking Time */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">
              Cooking Time (minutes)
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-800"
              placeholder="e.g. 30"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={cookingTime}
              onChangeText={setCookingTime}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-orange-500 rounded-2xl py-4 items-center"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Add Recipe</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
