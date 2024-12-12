import { auth } from "@/app/config/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithCredential,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
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
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);

        await AsyncStorage.setItem(
          "currentUser",
          JSON.stringify(userCredential.user)
        );

        return userCredential.user;
      }
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
      throw error;
    }
  };

  return { signInWithGoogle };
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    await AsyncStorage.removeItem("currentUser");
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const userString = await AsyncStorage.getItem("currentUser");
  return userString ? JSON.parse(userString) : null;
};
