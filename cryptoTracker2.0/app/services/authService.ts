import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import { router } from "expo-router";

export interface User {
  id: string;
  email: string;
  password?: string;
  password?: string;
  createdAt: string;
  provider?: "email" | "google";
  provider?: "email" | "google";
}

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1096241045242-5bkm3juvc5dbio96qe72uhkn12subf8p.apps.googleusercontent.com",
    androidClientId:
      "1096241045242-bn5kdkgn171qm50ekibfnamuma24vhrl.apps.googleusercontent.com",
    iosClientId:
      "1096241045242-l9pqrp90poguibms4o1auntfs45lrie4.apps.googleusercontent.com",
    clientId:
      "1096241045242-5bkm3juvc5dbio96qe72uhkn12subf8p.apps.googleusercontent.com",
    androidClientId:
      "1096241045242-bn5kdkgn171qm50ekibfnamuma24vhrl.apps.googleusercontent.com",
    iosClientId:
      "1096241045242-l9pqrp90poguibms4o1auntfs45lrie4.apps.googleusercontent.com",
  });

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();

      if (result.type === "success") {
        const { id_token } = result.params;
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${id_token}` },
          }
        );

        const userData = await response.json();

        const googleUser: User = {
          id: userData.sub,
          id: userData.sub,
          email: userData.email,
          createdAt: new Date().toISOString(),
          provider: "google",
          provider: "google",
        };

        const users = await authService.getUsers();
        const existingUser = users.find((u) => u.email === googleUser.email);
        const existingUser = users.find((u) => u.email === googleUser.email);

        if (!existingUser) {
          await AsyncStorage.setItem(
            "users",
            JSON.stringify([...users, googleUser])
          );
        }

        await AsyncStorage.setItem(
          "currentUser",
          JSON.stringify(existingUser || googleUser)
        );
        router.dismiss();
        return existingUser || googleUser;
      }
      return null;
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
      throw error;
    }
  };

  return { signInWithGoogle };
};

export const authService = {
  async getUsers(): Promise<User[]> {
    try {
      const users = await AsyncStorage.getItem("users");
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const users = await this.getUsers();
      const user = users.find(
        (u) =>
          u.email === email &&
          u.password === password &&
          u.provider !== "google"
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");
      const currentUser = await AsyncStorage.getItem("currentUser");
      return currentUser ? JSON.parse(currentUser) : null;
    } catch {
      return null;
    }
  },

  async isLoggedIn(): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      return currentUser !== null;
    } catch {
      return false;
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem("currentUser");
      router.push("/screens/auth/LoginScreen");
    } catch (error) {
      console.error("Logout error:", error);
      console.error("Logout error:", error);
      throw error;
    }
  },
};
