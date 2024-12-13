import React, { useState } from "react"
import { Text, View, StyleSheet, FlatList, RefreshControl } from "react-native"
import CoinList from "@/components/crypto/CoinList"
import SearchBar from "@/components/SearchBar"
import { COLORS, FONTS } from "@/utils/constants"

interface CoinSearchProps {
	filteredCoins: Coin[]
	searchQuery: string
	setSearchQuery: any
	handleSearchPress: (query: string) => void
	handleCoinPress: (coinId: string) => void
	coins: Coin[]
	loadCoins: () => void
	refreshing: boolean
}

export interface Coin {
	id: string
	name: string
	symbol: string
	current_price: number
	price_change_percentage_24h: number
	image: string
}

export default function CoinSearchScreen({
	handleCoinPress,
	handleSearchPress,
	filteredCoins,
	searchQuery,
	setSearchQuery,
	coins,
	loadCoins,
	refreshing,
}: CoinSearchProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Rechercher une crypto :</Text>
			<SearchBar
				value={searchQuery}
				onChangeText={setSearchQuery}
				onSearchPress={handleSearchPress}
			/>
			<FlatList
				data={filteredCoins}
				renderItem={({ item }) => (
					<CoinList coin={item} onPress={handleCoinPress} />
				)}
				keyExtractor={(item) => item.id}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={loadCoins} />
				}
				contentContainerStyle={styles.listContainer}
				ListEmptyComponent={
					<View style={styles.centerContainer}>
						<Text style={styles.emptyText}>No cryptocurrencies available</Text>
					</View>
				}
			/>
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
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	listContainer: {
		padding: 16,
	},
	emptyText: {
		fontSize: 16,
		fontFamily: FONTS.REGULAR,
		color: COLORS.GRAY,
		textAlign: "center",
	},
})
