import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as SMS from "expo-sms";
import * as Contacts from "expo-contacts";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { StripeProvider } from "@stripe/stripe-react-native";
import PaymentScreen from "../../../components/PaymentScreen";

interface CoinData {
  name: string;
  symbol: string;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
  };
}

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51QUnlT02AMgpJs2G86JDdqUPQ9CmvdxuauBwUQrxadp7eafegXR6yYQfyv3sAFwoWfI3Y1AxcNCC81xjxnyNhBTX00RWEAZzQY";

const CryptoDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );
        setCoin(response.data);
      } catch (err) {
        console.error("Error fetching coin details:", err);
        setError("Unable to load coin details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCoinDetails();
  }, [id]);

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Access to contacts is required to share details."
        );
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error requesting contacts permission:", err);
      return false;
    }
  };

  const loadContacts = async () => {
    try {
      const hasPermission = await requestContactsPermission();
      if (!hasPermission) return;

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
      } else {
        Alert.alert("No Contacts Found", "Your contacts list is empty.");
      }
    } catch (err) {
      console.error("Error loading contacts:", err);
      Alert.alert("Error", "Failed to load contacts. Please try again.");
    }
  };

  const getCryptoMessage = () => {
    if (!coin) return "";

    return `
      Hey, check out this cryptocurrency!
      - Name: ${coin.name ?? "N/A"}
      - Symbol: ${coin.symbol?.toUpperCase() ?? "N/A"}
      - Current Price: $${coin.market_data?.current_price?.usd?.toLocaleString() ?? "N/A"}
      - Market Cap: $${coin.market_data?.market_cap?.usd?.toLocaleString() ?? "N/A"}
    `;
  };

  const shareWithContact = async (contact: Contacts.Contact) => {
    try {
      const phoneNumber = contact.phoneNumbers?.[0]?.number;
      if (!phoneNumber) {
        Alert.alert("Error", "No phone number available for this contact.");
        return;
      }

      const message = getCryptoMessage();
      await SMS.sendSMSAsync(phoneNumber, message);
      Alert.alert("Success", `Message sent to ${contact.name}`);
    } catch (err) {
      console.error("Error sending SMS:", err);
      Alert.alert("Error", "Failed to send the message.");
    }
  };

  const shareWithOtherApps = async () => {
    try {
      const content = getCryptoMessage();
      const fileUri = FileSystem.cacheDirectory + "crypto-details.txt";

      await FileSystem.writeAsStringAsync(fileUri, content);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(
          "Sharing Unavailable",
          "This device does not support sharing."
        );
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: "Share Cryptocurrency Details",
      });

      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error("Sharing failed:", error);
      Alert.alert("Error", "Failed to share. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!coin) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{coin.name}</Text>
        <Text style={styles.symbol}>{coin.symbol?.toUpperCase() ?? "N/A"}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Current Price:</Text>
          <Text style={styles.detailValue}>
            ${coin.market_data?.current_price?.usd?.toLocaleString() ?? "N/A"}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Market Cap:</Text>
          <Text style={styles.detailValue}>
            ${coin.market_data?.market_cap?.usd?.toLocaleString() ?? "N/A"}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>24h High:</Text>
          <Text style={styles.detailValue}>
            ${coin.market_data?.high_24h?.usd?.toLocaleString() ?? "N/A"}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>24h Low:</Text>
          <Text style={styles.detailValue}>
            ${coin.market_data?.low_24h?.usd?.toLocaleString() ?? "N/A"}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price Change (24h):</Text>
          <Text
            style={[
              styles.detailValue,
              {
                color:
                  (coin.market_data?.price_change_percentage_24h ?? 0) >= 0
                    ? "green"
                    : "red",
              },
            ]}
          >
            {coin.market_data?.price_change_percentage_24h?.toFixed(2) ?? "N/A"}
            %
          </Text>
        </View>
      </View>

      {/* Wrap PaymentScreen in StripeProvider and error boundary */}
      <View style={styles.paymentContainer}>
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
          {paymentError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{paymentError}</Text>
            </View>
          ) : (
            <PaymentScreen />
          )}
        </StripeProvider>
      </View>

      <TouchableOpacity style={styles.button} onPress={loadContacts}>
        <Text style={styles.buttonText}>Load Contacts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={shareWithOtherApps}>
        <Text style={styles.buttonText}>Share With Other Apps</Text>
      </TouchableOpacity>

      {contacts.length > 0 && (
        <FlatList
          data={contacts}
          keyExtractor={(item) =>
            item.id?.toString() || `contact-${Date.now()}-${Math.random()}`
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => shareWithContact(item)}
            >
              <Text style={styles.contactName}>{item.name ?? "Unknown"}</Text>
              {item.phoneNumbers?.[0] && (
                <Text style={styles.contactInfo}>
                  {item.phoneNumbers[0].number}
                </Text>
              )}
            </TouchableOpacity>
          )}
          scrollEnabled={false} // Prevent nested scrolling issues
        />
      )}

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => router.push("/screens/main/HomeScreen")}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  header: {
    padding: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  symbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 5,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  paymentContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  button: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  contactItem: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  backButton: {
    marginBottom: 20,
  },
});

export default CryptoDetailScreen;