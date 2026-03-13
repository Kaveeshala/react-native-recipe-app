import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Recipe = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  cooking_time: number;
};

type Comment = {
  id: number;
  user_id: number;
  username: string;
  comment: string;
  created_at: string;
};

// Single Comment Card
const CommentCard = ({ item }: { item: Comment }) => (
  <View className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100">
    <View className="flex-row items-center mb-2">
      <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-2">
        <Text className="text-orange-500 font-bold text-sm">
          {item.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View>
        <Text className="text-gray-800 font-semibold text-sm">
          {item.username}
        </Text>
        <Text className="text-gray-300 text-xs">
          {new Date(item.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
    </View>
    <Text className="text-gray-500 text-sm leading-6">{item.comment}</Text>
  </View>
);

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/recipes/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          return;
        }
        setRecipe(data);
      } catch {
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/reviews`);
      const data = await res.json();
      setComments(data);
    } catch {
      console.log("Failed to fetch comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // Submit comment
  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Please write a comment");
      return;
    }

    const userStr = await AsyncStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      Alert.alert("Login required", "Please log in to comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          username: user.name,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      setComment("");
      fetchComments();
    } catch {
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-400">{error || "Recipe not found"}</Text>
        <TouchableOpacity
          className="mt-4 bg-orange-500 px-6 py-3 rounded-2xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageSource = recipe.image_url?.startsWith("http")
    ? { uri: recipe.image_url }
    : { uri: `${API_URL}/${recipe.image_url}` };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Recipe Image */}
        <View className="relative">
          <Image
            source={imageSource}
            className="w-full h-72"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-4 left-4 bg-white rounded-full p-2"
            style={{ elevation: 3 }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>
        </View>

        <View className="px-5 pt-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-orange-100 px-4 py-1.5 rounded-full">
              <Text className="text-orange-500 font-semibold text-sm">
                {recipe.category}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#9ca3af" />
              <Text className="text-gray-400 text-sm ml-1">
                {recipe.cooking_time} mins
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-gray-800 text-2xl font-bold mb-4">
            {recipe.title}
          </Text>

          <View className="h-px bg-gray-100 mb-4" />

          {/* Description */}
          <Text className="text-gray-800 text-lg font-bold mb-2">
            Description
          </Text>
          <Text className="text-gray-500 text-base leading-7 mb-8">
            {recipe.description}
          </Text>

          {/* Comments Section */}
          <View className="h-px bg-gray-100 mb-6" />

          <Text className="text-gray-800 text-lg font-bold mb-4">
            Comments ({comments.length})
          </Text>

          {/* Comment List */}
          {comments.length === 0 ? (
            <View className="bg-gray-50 rounded-2xl p-5 items-center mb-6">
              <Text className="text-2xl mb-2">💬</Text>
              <Text className="text-gray-400 text-sm">
                No comments yet. Be the first!
              </Text>
            </View>
          ) : (
            comments.map((item) => <CommentCard key={item.id} item={item} />)
          )}

          {/* Add Comment Box */}
          <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-10 mt-2">
            <Text className="text-gray-800 font-bold text-base mb-3">
              Leave a Comment
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm"
              placeholder="Write your comment here..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
              style={{ minHeight: 80 }}
            />
            <TouchableOpacity
              className="bg-orange-500 rounded-xl py-3 items-center mt-3"
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold">Post Comment</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
