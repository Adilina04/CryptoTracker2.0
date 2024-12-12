import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, AUTH_ERRORS } from "../../../utils/constants";
import { debugStorage } from "../../../utils/debugUtils";

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    debugStorage.logStorageContent();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError(AUTH_ERRORS.FIELDS_REQUIRED);
      return;
    }

    if (!validateEmail(email)) {
      setError(AUTH_ERRORS.INVALID_EMAIL);
      return;
    }

    if (password !== confirmPassword) {
      setError(AUTH_ERRORS.PASSWORDS_NOT_MATCH);
      return;
    }

    if (password.length < 6) {
      setError(AUTH_ERRORS.PASSWORD_TOO_SHORT);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const users = await AsyncStorage.getItem("users");
      const parsedUsers = users ? JSON.parse(users) : [];

      const userExists = parsedUsers.some(
        (user: { email: string }) => user.email === email
      );
      if (userExists) {
        setError(AUTH_ERRORS.EMAIL_EXISTS);
        return;
      }

      const newUser = {
        email,
        password,
        id: Date.now().toString(),
      };

      const updatedUsers = [...parsedUsers, newUser];
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      await AsyncStorage.setItem("currentUser", JSON.stringify(newUser));

      router.push("/screens/main/HomeScreen");
    } catch (err) {
      setError(AUTH_ERRORS.GENERIC_ERROR);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>CryptoTracker</Text>
          <Text style={styles.subtitle}>Create Your Account</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.GRAY} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={COLORS.GRAY}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.GRAY} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={COLORS.GRAY}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.GRAY} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor={COLORS.GRAY}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/auth/LoginScreen")}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: 32,
    textAlign: "center",
    marginBottom: 8,
    color: COLORS.PRIMARY,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: COLORS.GRAY,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.TEXT,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: COLORS.SECONDARY,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: FONTS.BOLD,
  },
  errorText: {
    color: COLORS.ERROR,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: FONTS.REGULAR,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: COLORS.GRAY,
    fontFamily: FONTS.REGULAR,
  },
  loginLink: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.BOLD,
  }
});

export default RegisterScreen;