import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="screens/auth/LoginScreen" />
      <Stack.Screen name="screens/auth/RegisterScreen" />
      <Stack.Screen name="screens/main/HomeScreen" />
      <Stack.Screen name="screens/auth/AuthenticationScreen" />
    </Stack>
  );
}