import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { fetchCoins } from "@/utils/api"

const HomeScreen: React.FC = () => {
	const [coins, setCoins] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const loadCoins = async () => {
		try {
			const data = await fetchCoins("usd")
			setCoins(data)
		} catch (err) {
			setError("Impossible de r�cup�rer les donn�es.")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadCoins()
	}, [])

	if (loading) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		)
	}

	if (error) {
		return (
			<View>
				<Text>{error}</Text>
			</View>
		)
	}

	return (
		<View>
			<Text>Crypto List</Text>
			<FlatList
				data={coins}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							router.push(`/screens/main/CryptoDetailScreen?id=${item.id}`)
						}
					>
						<Text>{item.name}</Text>
						<Text>{item.current_price} USD</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	)
}

export default HomeScreen
