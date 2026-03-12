import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---- Dummy Data ----
const DUMMY_RECIPES = [
  {
    id: 1,
    title: "Spaghetti Bolognese",
    description: "A classic Italian pasta dish with rich meat sauce and fresh tomatoes.",
    image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    category: "Italian",
    cooking_time: 45,
  },
  {
    id: 2,
    title: "Chicken Curry",
    description: "Creamy and flavorful chicken curry with aromatic spices and coconut milk.",
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    category: "Asian",
    cooking_time: 35,
  },
  {
    id: 3,
    title: "Avocado Toast",
    description: "Simple and healthy breakfast with creamy avocado on toasted sourdough.",
    image_url: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400",
    category: "Breakfast",
    cooking_time: 10,
  },
  {
    id: 4,
    title: "Beef Tacos",
    description: "Crispy tacos filled with seasoned beef, fresh salsa, and melted cheese.",
    image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    category: "Mexican",
    cooking_time: 25,
  },
  {
    id: 5,
    title: "Margherita Pizza",
    description: "Classic wood-fired pizza with fresh mozzarella, tomato, and basil.",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    category: "Italian",
    cooking_time: 30,
  },
];

// ---- Type ----
type Recipe = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  cooking_time: number;
};

// ---- Recipe Card Component ----
const RecipeCard = ({ item }: { item: Recipe }) => (
  <TouchableOpacity className="bg-white rounded-2xl mb-4 border border-gray-100 overflow-hidden"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    {/* Recipe Image */}
    <Image
      source={{ uri: item.image_url }}
      className="w-full h-44"
      resizeMode="cover"
    />

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

// ---- Home Screen ----
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-5 pt-4">

        {/* Header */}
        <View className="mb-6">
          <Text className="text-gray-400 text-base">Hello, Chef 👋</Text>
          <Text className="text-gray-800 text-3xl font-bold mt-1">Recipes</Text>
        </View>

        {/* Recipe List */}
        <FlatList
          data={DUMMY_RECIPES}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RecipeCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

      </View>
    </SafeAreaView>
  );
}
