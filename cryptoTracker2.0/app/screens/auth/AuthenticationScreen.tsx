import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthenticationScreen = () => {
  const router = useRouter();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometricSettings();
  }, []);

  const checkBiometricSettings = async () => {
    try {
      const setting = await AsyncStorage.getItem("biometricEnabled");
      setIsBiometricEnabled(setting === "true");
    } catch (error) {
      console.error(
        "Erreur lors de la lecture des paramètres biométriques:",
        error
      );
    }
  };

  const toggleBiometric = async (value: boolean) => {
    try {
      await AsyncStorage.setItem("biometricEnabled", value.toString());
      setIsBiometricEnabled(value);

      if (!value) {
        router.push("/screens/main/HomeScreen");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde des paramètres biométriques:",
        error
      );
    }
  };

  const authenticate = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        alert("Votre appareil ne supporte pas l'authentification biométrique");
        router.push("/screens/main/HomeScreen");
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        alert("Aucune donnée biométrique enregistrée sur cet appareil");
        router.push("/screens/main/HomeScreen");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authentification biométrique",
        fallbackLabel: "Utiliser le mot de passe",
        disableDeviceFallback: false,
      });

      if (result.success) {
        await AsyncStorage.setItem("biometricEnabled", "true");
        router.push("/screens/main/HomeScreen");
      }
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sécurité Biométrique</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          Activer l'authentification biométrique
        </Text>
        <Switch value={isBiometricEnabled} onValueChange={toggleBiometric} />
      </View>

      {isBiometricEnabled && (
        <TouchableOpacity style={styles.button} onPress={authenticate}>
          <Text style={styles.buttonText}>Scanner</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#2196F3",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
    justifyContent: "space-between",
  },
  switchText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AuthenticationScreen;
