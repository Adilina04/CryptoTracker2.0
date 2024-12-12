  import React, { useEffect, useState } from "react";
  import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
  import axios from "axios";
  import { useLocalSearchParams } from 'expo-router';

  const CryptoDetailScreen: React.FC = () => {
     const { id } = useLocalSearchParams(); 
    const [coin, setCoin] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchCoinDetails = async () => {
        try {
          const response = await axios.get(`https: api.coingecko.com/api/v3/coins/${id}`);
          setCoin(response.data);
        } catch (err) {
          console.error(err);
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

    if (!coin) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load coin details!</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{coin.name}</Text>
        <Text style={styles.detail}>Symbol: {coin.symbol.toUpperCase()}</Text>
        <Text style={styles.detail}>
          Current Price: ${coin.market_data.current_price.usd.toLocaleString()}
        </Text>
        <Text style={styles.detail}>
          Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}
        </Text>
        <Text style={styles.detail}>
          24h High: ${coin.market_data.high_24h.usd.toLocaleString()}
        </Text>
        <Text style={styles.detail}>
          24h Low: ${coin.market_data.low_24h.usd.toLocaleString()}
        </Text>
      </ScrollView>
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
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    detail: {
      fontSize: 18,
      marginBottom: 5,
    },
  });

  export default CryptoDetailScreen;
