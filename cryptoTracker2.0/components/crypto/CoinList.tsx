import React, { useEffect, useState } from "react"
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from "react-native"
import { router, useRouter } from "expo-router"

interface coinListProps {
	coinList: any[]
	error?: string
}

const CoinList = ({ coinList, error }: coinListProps) => {
	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.error}>{error}</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={coinList}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.coin}
						onPress={() =>
							router.push(`/screens/main/CryptoDetailScreen?id=${item.id}`)
						} // Navigue vers la page de d�tail
					>
						<Text style={styles.name}>{item.name}</Text>
						<Text style={styles.price}>{item.current_price} USD</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	coin: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	name: {
		fontSize: 18,
		fontWeight: "bold",
	},
	price: {
		fontSize: 16,
	},
	error: {
		color: "red",
		fontSize: 16,
		textAlign: "center",
		marginTop: 20,
	},
})

export default CoinList
