import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, ScrollView } from "react-native";
import * as SMS from "expo-sms";
import * as Contacts from "expo-contacts";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

const CryptoDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [coin, setCoin] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Access to contacts is required to share details."
      );
      return false;
    }
    return true;
  };

  const loadContacts = async () => {
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
  };

  const getCryptoMessage = () => {
    return `
      Hey, check out this cryptocurrency!
      - Name: ${coin?.name}
      - Symbol: ${coin?.symbol.toUpperCase()}
      - Current Price: $${coin?.market_data.current_price.usd.toLocaleString()}
      - Market Cap: $${coin?.market_data.market_cap.usd.toLocaleString()}
    `;
  };

  const shareWithContact = (contact: any) => {
    const message = getCryptoMessage();

    SMS.sendSMSAsync(contact.phoneNumbers[0]?.number, message)
      .then(() => {
        Alert.alert("Message Sent", `Message sent to ${contact.name}`);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to send the message.");
        console.error(error);
      });
  };

  const shareWithOtherApps = async () => {
    const content = getCryptoMessage();
    const fileUri = FileSystem.cacheDirectory + "crypto-details.txt";

    try {
      await FileSystem.writeAsStringAsync(fileUri, content);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing Unavailable", "This device does not support sharing.");
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: "Share Cryptocurrency Details",
      });

      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error("Sharing failed:", error);
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

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{coin?.name}</Text>
          <Text style={styles.symbol}>{coin?.symbol.toUpperCase()}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Current Price:</Text>
            <Text style={styles.detailValue}>
              ${coin?.market_data.current_price.usd.toLocaleString()}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Market Cap:</Text>
            <Text style={styles.detailValue}>
              ${coin?.market_data.market_cap.usd.toLocaleString()}
            </Text>
          </View>
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => shareWithContact(item)}
              >
                <Text style={styles.contactName}>{item.name}</Text>
                {item.phoneNumbers && (
                  <Text style={styles.contactInfo}>
                    {item.phoneNumbers[0]?.number}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screens/main/HomeScreen")}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  header: {
    marginBottom: 20,
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
  button: {
    marginTop: 20,
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    fontSize: 14,
    color: "#555",
  },
});


export default CryptoDetailScreen;
