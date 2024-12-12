import React, { useState, useEffect } from "react"
import { Text, View, StyleSheet } from "react-native"
import CoinSearchScreen from "@/app/screens/CoinSearchScreen"

export default function Index() {
	return (
		<View style={styles.container}>
			<CoinSearchScreen />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	title: {
		marginBottom: 16,
		fontSize: 18,
		fontWeight: "bold",
	},
})
