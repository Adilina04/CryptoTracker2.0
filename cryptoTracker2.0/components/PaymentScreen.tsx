import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      const secret =
        "pk_test_51QUnlT02AMgpJs2G86JDdqUPQ9CmvdxuauBwUQrxadp7eafegXR6yYQfyv3sAFwoWfI3Y1AxcNCC81xjxnyNhBTX00RWEAZzQY";
      console.log(secret);
      if (secret) {
        setClientSecret(secret);
      } else {
        Alert.alert("Erreur", "Client Secret manquant");
      }
    };
    fetchClientSecret();
  }, []);

  const handlePayment = async () => {
    if (!clientSecret) {
      Alert.alert("Erreur", "Le client secret est manquant");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom du titulaire de la carte est requis");
      return;
    }

    setLoading(true);

    try {
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            name,
          },
        },
      });

      console.log("Payment Intent:", paymentIntent);
      console.log("Error:", error);

      if (error) {
        Alert.alert("Erreur", error.message);
      } else if (paymentIntent) {
        Alert.alert("Succès", "Paiement réussi !");
      }
    } catch (error) {
      console.error("Erreur de paiement :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails du paiement</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du titulaire de la carte"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#aaa"
      />
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePayment}
        disabled={loading || !clientSecret || !name.trim()}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Payer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
		borderRadius: 10,
    padding: 20,
    backgroundColor: "white",
		shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
		marginTop:10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1F509A",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#C0C0C0",
  },
  cardContainer: {
    width: "100%",
    height: 50,
    marginVertical: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#9bb1d1",
  },
});

export default PaymentScreen;
