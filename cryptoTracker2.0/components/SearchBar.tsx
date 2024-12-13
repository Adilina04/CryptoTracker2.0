import React from "react"
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Keyboard,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SearchBarProps {
	value: string
	onChangeText: (text: string) => void
	placeholder?: string
	onSearchPress?: (searchQuery: string) => void
}

const SearchBar = ({
	value,
	onChangeText,
	placeholder = "Rechercher...",
	onSearchPress,
}: SearchBarProps) => {
	const handleSearch = () => {
		Keyboard.dismiss()
		if (onSearchPress) {
			onSearchPress(value.trim())
		}
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor='grey'
				returnKeyType='search'
				onSubmitEditing={handleSearch}
			/>
			<TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
				<Ionicons name='search' size={20} color='white' />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 10,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		width: "100%",
		height: 45,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: "black",
		paddingLeft: 15,
		paddingRight: 10,
	},
	iconContainer: {
		backgroundColor: "orange",
		height: "100%",
		width: 45,
		justifyContent: "center",
		alignItems: "center",
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
	},
})

export default SearchBar
