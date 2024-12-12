import CoinList from "@/components/crypto/CoinList";
import { Text, View } from "react-native";
import HomeScreen from "./screens/main/HomeScreen";
import LoginScreen from "./screens/auth/LoginScreen";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <LoginScreen/>
    </View>
  );
}
