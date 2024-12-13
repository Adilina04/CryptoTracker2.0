import React, { useEffect, useState } from "react"
import { View, TextInput, StyleSheet, Button, Alert } from "react-native"
import { CardField, useStripe } from "@stripe/stripe-react-native"

const PaymentScreen = () => {
	const { confirmPayment } = useStripe()
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [name, setName] = useState<string>("")

	useEffect(() => {
		const fetchClientSecret = async () => {
			//const secret = process.env.STRIPE_API_KEY
			const secret = "pk_test_51QUnlT02AMgpJs2G86JDdqUPQ9CmvdxuauBwUQrxadp7eafegXR6yYQfyv3sAFwoWfI3Y1AxcNCC81xjxnyNhBTX00RWEAZzQY"
			console.log(secret)
			if (secret) {
				setClientSecret(secret)
			} else {
				Alert.alert("Erreur", "Client Secret manquant")
			}
		}
		fetchClientSecret()
	}, [])

	const handlePayment = async () => {
		if (!clientSecret) {
			Alert.alert("Erreur", "Le client secret est manquant")
			return
		}
		if (!name) {
			Alert.alert("Erreur", "Le nom du titulaire de la carte est requis")
			return
		}

		setLoading(true)

		try {
			const { paymentIntent, error } = await confirmPayment(clientSecret, {
				paymentMethodType: "Card",
				paymentMethodData: {
					billingDetails: {
						name,
					},
				},
			})

			console.log("Payment Intent:", paymentIntent)
			console.log("Error:", error)

			if (error) {
				Alert.alert("Erreur", error.message)
			} else if (paymentIntent) {
				Alert.alert("Succès", "Paiement réussi !")
			}
		} catch (error) {
			console.error("Erreur de paiement :", error)
			Alert.alert("Erreur", "Une erreur est survenue lors du paiement")
		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder='Name of user'
				value={name}
				onChangeText={setName}
			/>
			<CardField
				postalCodeEnabled={true}
				placeholders={{
					number: "4242 4242 4242 4242",
				}}
				cardStyle={styles.card}
				style={styles.cardContainer}
			/>
			<Button
				title={loading ? "Chargement..." : "Payer"}
				onPress={handlePayment}
				disabled={loading || !clientSecret || !name}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		backgroundColor: "black",
	},
	card: { backgroundColor: "#f5f5f5" },
	cardContainer: { height: 50, marginVertical: 30 },
	input: {
		height: 40,
		borderColor: "yellow",
		borderWidth: 1,
		marginBottom: 20,
		paddingLeft: 10,
	},
})

export default PaymentScreen
