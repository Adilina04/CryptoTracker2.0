import React, { useState, useEffect } from "react"
import { Text, View, StyleSheet } from "react-native"
import CoinList from "@/components/crypto/CoinList"
import SearchBar from "@/components/SearchBar"
import { fetchCoins } from "@/utils/api"

export default function CoinSearchScreen() {
	const [searchQuery, setSearchQuery] = useState("")
	const [coinList, setCoinList] = useState<any[]>([])
	const [filteredCoins, setFilteredCoins] = useState<any[]>([])
	const [error, setError] = useState<string | undefined>(undefined)

	useEffect(() => {
		const loadCoins = async () => {
			try {
				const data = await fetchCoins("usd")
				setCoinList(data)
				setFilteredCoins(data) // Initialement, tous les coins sont affichés
			} catch (err) {
				setError("Impossible de récupérer les données.")
			}
		}

		loadCoins()
	}, [])

	const handleSearchPress = (query: string) => {
		const trimmedQuery = query.trim().toLowerCase()

		console.log(trimmedQuery, coinList, filteredCoins)

		if (trimmedQuery === "") {
			setFilteredCoins(coinList)
		} else {
			const filtered = coinList.filter((coin) =>
				coin.name.toLowerCase().includes(trimmedQuery)
			)

			if (filtered.length === 0) {
				setFilteredCoins(coinList)
			} else {
				setFilteredCoins(filtered)
			}
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Rechercher une crypto :</Text>
			<SearchBar
				value={searchQuery}
				onChangeText={setSearchQuery}
				onSearchPress={handleSearchPress}
			/>
			<CoinList coinList={filteredCoins} error={error} />
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
