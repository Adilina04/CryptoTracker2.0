import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const CryptoDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams(); 
  const [coin, setCoin] = useState<any>(null);
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
        <Text style={styles.title}>{coin.name}</Text>
        <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Current Price:</Text>
          <Text style={styles.detailValue}>
            ${coin.market_data.current_price.usd.toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Market Cap:</Text>
          <Text style={styles.detailValue}>
            ${coin.market_data.market_cap.usd.toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>24h High:</Text>
          <Text style={styles.detailValue}>
            ${coin.market_data.high_24h.usd.toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>24h Low:</Text>
          <Text style={styles.detailValue}>
            ${coin.market_data.low_24h.usd.toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price Change (24h):</Text>
          <Text
            style={[
              styles.detailValue,
              { color: coin.market_data.price_change_percentage_24h >= 0 ? "green" : "red" },
            ]}
          >
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => console.log("Go back!")}>
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
});

export default CryptoDetailScreen;
