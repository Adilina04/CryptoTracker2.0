import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

interface CoinListItemProps {
  coin: Coin;
  onPress: (id: string) => void;
}

const CoinList: React.FC<CoinListItemProps> = ({ coin, onPress }) => (
  <TouchableOpacity 
    style={styles.coinItem}
    onPress={() => onPress(coin.id)}
  >
    <Image source={{ uri: coin.image }} style={styles.coinImage} />
    
    <View style={styles.coinInfo}>
      <Text style={styles.coinName}>{coin.name}</Text>
      <Text style={styles.coinSymbol}>{coin.symbol.toUpperCase()}</Text>
    </View>

    <View style={styles.priceContainer}>
      <Text style={styles.price}>${coin.current_price.toLocaleString()}</Text>
      <Text style={[
        styles.priceChange,
        coin.price_change_percentage_24h > 0 ? styles.positiveChange : styles.negativeChange
      ]}>
        {coin.price_change_percentage_24h > 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: COLORS.TEXT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coinImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  coinInfo: {
    flex: 1,
    marginLeft: 12,
  },
  coinName: {
    fontSize: 16,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
  },
  coinSymbol: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
    color: COLORS.GRAY,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
  },
  priceChange: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
  },
  positiveChange: {
    color: COLORS.SUCCESS,
  },
  negativeChange: {
    color: COLORS.ERROR,
  },
});

export default CoinList;
