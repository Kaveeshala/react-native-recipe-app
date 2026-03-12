import { Stack } from "expo-router";
import './global.css';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
  return (
    <SafeAreaView className="flex flex-1">
       <Stack screenOptions={{ headerShown: false }} />
       <StatusBar />
    </SafeAreaView>
  )
}
