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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import * as AppleAuthentication from "expo-apple-authentication";
import { COLORS, FONTS, AUTH_ERRORS } from "../../../utils/constants";
import { authService } from "@/app/services/authService";
import { useGoogleAuth } from "@/app/services/authService";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [appleAuthAvailable, setAppleAuthAvailable] = useState<boolean>(false);
  const { signInWithGoogle } = useGoogleAuth();

  useEffect(() => {
    checkAppleAuthAvailability();
  }, []);

  interface AuthError {
    code?: string;
    message?: string;
  }

  const checkAppleAuthAvailability = async () => {
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(available);
    } catch (error) {
      console.error("Error checking Apple auth availability:", error);
      setAppleAuthAvailable(false);
    }
  };

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) return false;

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) return false;

      return true;
    } catch (error: unknown) {
      console.error("Error checking biometric support:", error);
      return false;
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verify your identity",
        disableDeviceFallback: false,
        cancelLabel: "Cancel",
      });
      return result.success;
    } catch (error: unknown) {
      console.error("Error during biometric auth:", error);
      return false;
    }
  };

  const processBiometricSetup = async () => {
    Alert.alert(
      "Enable Biometric Authentication",
      "Would you like to enable biometric authentication for enhanced security?",
      [
        {
          text: "No Thanks",
          onPress: async () => {
            await AsyncStorage.setItem("biometricEnabled", "false");
            router.push("/screens/main/HomeScreen");
          },
          style: "cancel",
        },
        {
          text: "Enable",
          onPress: async () => {
            await AsyncStorage.setItem("biometricEnabled", "true");
            const biometricSuccess = await handleBiometricAuth();
            if (biometricSuccess) {
              router.push("/screens/main/HomeScreen");
            } else {
              setError("Biometric verification failed");
            }
          },
        },
      ]
    );
  };

  const handleAuthSuccess = async (user: any) => {
    try {
      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      const biometricSupported = await checkBiometricSupport();

      if (biometricSupported) {
        const biometricEnabled = await AsyncStorage.getItem("biometricEnabled");

        if (biometricEnabled === null) {
          await processBiometricSetup();
        } else if (biometricEnabled === "true") {
          const biometricSuccess = await handleBiometricAuth();
          if (biometricSuccess) {
            router.push("/screens/main/HomeScreen");
          } else {
            setError("Biometric verification failed");
          }
        } else {
          router.push("/screens/main/HomeScreen");
        }
      } else {
        router.push("/screens/main/HomeScreen");
      }
    } catch (error: unknown) {
      console.error("Error in auth success:", error);
      setError(AUTH_ERRORS.GENERIC_ERROR);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError(AUTH_ERRORS.FIELDS_REQUIRED);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await authService.login(email, password);

      if (user) {
        await handleAuthSuccess(user);
      } else {
        setError(AUTH_ERRORS.INVALID_CREDENTIALS);
      }
    } catch (error: unknown) {
      console.error(error);
      setError(AUTH_ERRORS.GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setLoading(true);
      setError(null);

      let user = null;

      switch (provider) {
        case "Google":
          user = await signInWithGoogle();
          break;
        case "Apple":
          if (appleAuthAvailable) {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            if (credential) {
              user = {
                id: credential.user,
                email: credential.email,
                name: `${credential.fullName?.givenName || ""} ${credential.fullName?.familyName || ""}`.trim(),
                provider: "apple",
              };
            }
          } else {
            setError("Apple Sign In is not available on this device");
            return;
          }
          break;
        case "X":
          setError(AUTH_ERRORS.TWITTER_NOT_IMPLEMENTED);
          return;
        default:
          setError(`${provider} login is not supported`);
          return;
      }

      if (user) {
        await handleAuthSuccess(user);
      }
    } catch (error: unknown) {
      console.error(error);
      const authError = error as AuthError;
      if (authError.code === "ERR_CANCELED") {
        setError("Login was canceled");
      } else {
        setError(AUTH_ERRORS.GENERIC_ERROR);
      }
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
          <Text style={styles.subtitle}>Sign in to continue</Text>

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
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.GRAY}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={COLORS.GRAY}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View style={styles.socialSection}>
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>OR</Text>
                <View style={styles.separatorLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin("Google")}
                  disabled={loading}
                >
                  <Ionicons name="logo-google" size={20} color={COLORS.TEXT} />
                  <Text style={styles.socialButtonTextDark}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.xButton]}
                  onPress={() => handleSocialLogin("X")}
                  disabled={loading}
                >
                  <Text style={styles.socialButtonTextLight}>X</Text>
                </TouchableOpacity>

                {Platform.OS === "ios" && appleAuthAvailable && (
                  <TouchableOpacity
                    style={[styles.socialButton, styles.appleButton]}
                    onPress={() => handleSocialLogin("Apple")}
                    disabled={loading}
                  >
                    <Ionicons
                      name="logo-apple"
                      size={20}
                      color={COLORS.WHITE}
                    />
                    <Text style={styles.socialButtonTextLight}>Apple</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/auth/RegisterScreen")}
                disabled={loading}
              >
                <Text style={styles.registerLink}>Sign Up</Text>
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
    flexDirection: "row",
    alignItems: "center",
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
  socialSection: {
    marginTop: 20,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  separatorText: {
    marginHorizontal: 10,
    color: COLORS.GRAY,
    fontFamily: FONTS.REGULAR,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButton: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  xButton: {
    backgroundColor: "#000000",
  },
  appleButton: {
    backgroundColor: COLORS.TEXT,
  },
  socialButtonTextDark: {
    color: COLORS.TEXT,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: FONTS.BOLD,
  },
  socialButtonTextLight: {
    color: COLORS.WHITE,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: FONTS.BOLD,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: COLORS.GRAY,
    fontFamily: FONTS.REGULAR,
  },
  registerLink: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.BOLD,
  },
});

export default LoginScreen;