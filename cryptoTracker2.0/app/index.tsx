import { useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { authService } from "@/app/services/authService";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await authService.isLoggedIn();
      if (isLoggedIn) {
        router.push("/screens/main/HomeScreen");
      }
    };
    checkAuth();
  }, [router]);

  return <Redirect href="/screens/auth/LoginScreen" />;
}
