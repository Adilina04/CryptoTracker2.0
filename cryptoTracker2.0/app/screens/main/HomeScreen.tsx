import React, { useCallback, useEffect, useState } from "react"
import {
	View,
	Text,
	StyleSheet,
	Alert,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "@/utils/api"
import { COLORS, FONTS } from "@/utils/constants"
import { authService } from "@/app/services/authService"
import Header from "@/components/crypto/Header"
import CoinSearchScreen from "../searchBar/CoinSearchScreen"

export interface Coin {
	id: string
	name: string
	symbol: string
	current_price: number
	price_change_percentage_24h: number
	image: string
}

const HomeScreen: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const [coins, setCoins] = useState<Coin[]>([])
	const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins)
	const [loading, setLoading] = useState<boolean>(true)
	const [refreshing, setRefreshing] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [userEmail, setUserEmail] = useState<string>("")
	const router = useRouter()

	useEffect(() => {
		loadUserInfo()
		loadCoins()
	}, [])

	useFocusEffect(
		useCallback(() => {
			setFilteredCoins(coins)
		}, [coins])
	)

	const handleSearchPress = (query: string) => {
		const trimmedQuery = query.trim().toLowerCase()
		if (trimmedQuery === "") {
			setFilteredCoins(coins)
		} else {
			const filtered = coins.filter((coin) =>
				coin.name.toLowerCase().includes(trimmedQuery)
			)

			if (filtered.length === 0) {
				setFilteredCoins([])
			} else {
				setFilteredCoins(filtered)
			}
		}
	}

	const loadUserInfo = async () => {
		const user = await authService.getCurrentUser()
		if (user) {
			setUserEmail(user.email)
		}
	}

	const loadCoins = async () => {
		try {
			const data = await api.fetchCoins({ currency: "usd" })
			setCoins(data)
			setError(null)
		} catch (err) {
			setError("Unable to fetch cryptocurrency data. Please try again later.")
		} finally {
			setLoading(false)
			setRefreshing(false)
		}
	}

	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Logout",
				style: "destructive",
				onPress: async () => {
					try {
						await authService.logout()
					} catch (error) {
						Alert.alert("Error", "Failed to logout. Please try again.")
					}
				},
			},
		])
	}

	const handleCoinPress = (coinId: string) => {
		router.push(`/screens/main/CryptoDetailScreen?id=${coinId}`)
	}

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<Header userEmail={userEmail} onLogout={handleLogout} />
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color={COLORS.PRIMARY} />
				</View>
			</SafeAreaView>
		)
	}

	if (error) {
		return (
			<SafeAreaView style={styles.container}>
				<Header userEmail={userEmail} onLogout={handleLogout} />
				<View style={styles.centerContainer}>
					<Text style={styles.errorText}>{error}</Text>
					<TouchableOpacity style={styles.retryButton} onPress={loadCoins}>
						<Text style={styles.retryButtonText}>Retry</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header userEmail={userEmail} onLogout={handleLogout} />
			<CoinSearchScreen
				coins={coins}
				handleCoinPress={handleCoinPress}
				handleSearchPress={handleSearchPress}
				loadCoins={loadCoins}
				refreshing={refreshing}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				filteredCoins={filteredCoins}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.BACKGROUND,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		fontFamily: FONTS.REGULAR,
		color: COLORS.ERROR,
		textAlign: "center",
		marginBottom: 16,
	},
	retryButton: {
		backgroundColor: COLORS.PRIMARY,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryButtonText: {
		color: COLORS.WHITE,
		fontFamily: FONTS.BOLD,
		fontSize: 16,
	},
})

export default HomeScreen
