import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { API_URL } from "../../constants/api";
import AddRecipeScreen from "../(recipes)/add-recipe";

// Type
type Recipe = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  cooking_time: number;
};

// Recipe Card Component
const RecipeCard = ({ item }: { item: Recipe }) => {
  const imageSource =
    item.image_url && item.image_url.startsWith("http")
      ? { uri: item.image_url }
      : { uri: `${API_URL}/${item.image_url}` };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 border border-gray-100 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Recipe Image */}
      <Image source={imageSource} className="w-full h-44" resizeMode="cover" />

      {/* Recipe Info */}
      <View className="p-4">
        {/* Category Badge */}
        <View className="bg-orange-100 self-start px-3 py-1 rounded-full mb-2">
          <Text className="text-orange-500 text-xs font-semibold">
            {item.category}
          </Text>
        </View>

        {/* Title */}
        <Text className="text-gray-800 text-lg font-bold mb-1">
          {item.title}
        </Text>

        {/* Description */}
        <Text className="text-gray-500 text-sm" numberOfLines={2}>
          {item.description}
        </Text>

        {/* Cooking Time */}
        <View className="flex-row items-center mt-3">
          <Ionicons name="time-outline" size={14} color="#9ca3af" />
          <Text className="text-gray-400 text-xs ml-1">
            {item.cooking_time} mins
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipes`);
      const data = await response.json();
      setRecipes(data);
      setError("");
    } catch (err) {
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch on first load
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Re-fetch every time user comes back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-gray-800 text-3xl font-bold mt-1">
              Recipes
            </Text>
          </View>

          {/* Add Recipe Button */}
          <TouchableOpacity
            className="bg-orange-500 w-11 h-11 rounded-full items-center justify-center"
            onPress={() => router.push("/(recipes)/add-recipe")}
          >
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#f97316" />
            <Text className="text-gray-400 mt-3">Loading recipes...</Text>
          </View>
        )}

        {/* Error State */}
        {!loading && error !== "" && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-red-400 text-base text-center">{error}</Text>
            <TouchableOpacity
              className="mt-4 bg-orange-500 px-6 py-3 rounded-2xl"
              onPress={fetchRecipes}
            >
              <Text className="text-white font-bold">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!loading && error === "" && recipes.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-5xl mb-4">🍽️</Text>
            <Text className="text-gray-500 text-base text-center">
              No recipes yet.
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-1">
              Tap + to add your first recipe!
            </Text>
          </View>
        )}

        {/* Recipe List */}
        {!loading && error === "" && recipes.length > 0 && (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RecipeCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#f97316"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
