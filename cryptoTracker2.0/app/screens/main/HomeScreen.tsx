import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { COLORS, FONTS } from '../../../utils/constants';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [topCryptos, setTopCryptos] = useState([
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: '45,321.54', change: '+5.2' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: '2,456.78', change: '-2.1' },
    { id: 3, name: 'Cardano', symbol: 'ADA', price: '1.23', change: '+1.8' },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="CryptoTracker" showSettings rightIcon="notifications-outline" />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Portfolio Card */}
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
          <Text style={styles.portfolioValue}>$12,345.67</Text>
          <Text style={styles.portfolioChange}>+$234.56 (1.9%)</Text>
          
          <View style={styles.portfolioActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle-outline" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.actionButtonText}>Add</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="swap-horizontal-outline" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.actionButtonText}>Trade</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trending-up-outline" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.actionButtonText}>Stats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Market Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Overview</Text>
          {topCryptos.map((crypto) => (
            <TouchableOpacity key={crypto.id} style={styles.cryptoItem}>
              <View style={styles.cryptoInfo}>
                <View style={styles.cryptoIconContainer}>
                  <Ionicons name="logo-bitcoin" size={24} color={COLORS.PRIMARY} />
                </View>
                <View>
                  <Text style={styles.cryptoName}>{crypto.name}</Text>
                  <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
                </View>
              </View>
              <View style={styles.cryptoValues}>
                <Text style={styles.cryptoPrice}>${crypto.price}</Text>
                <Text style={[
                  styles.cryptoChange,
                  { color: crypto.change.startsWith('+') ? COLORS.SUCCESS : COLORS.ERROR }
                ]}>
                  {crypto.change}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {['Portfolio', 'Markets', 'News', 'Alerts'].map((item) => (
              <TouchableOpacity key={item} style={styles.quickAccessItem}>
                <View style={styles.quickAccessIcon}>
                  <Ionicons 
                    name={
                      item === 'Portfolio' ? 'wallet-outline' :
                      item === 'Markets' ? 'trending-up-outline' :
                      item === 'News' ? 'newspaper-outline' :
                      'notifications-outline'
                    } 
                    size={24} 
                    color={COLORS.PRIMARY} 
                  />
                </View>
                <Text style={styles.quickAccessText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  portfolioCard: {
    margin: 16,
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    shadowColor: COLORS.TEXT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  portfolioLabel: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: COLORS.GRAY,
  },
  portfolioValue: {
    fontFamily: FONTS.BOLD,
    fontSize: 32,
    color: COLORS.TEXT,
    marginTop: 4,
  },
  portfolioChange: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.SUCCESS,
    marginTop: 4,
  },
  portfolioActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 4,
    fontFamily: FONTS.REGULAR,
    fontSize: 12,
    color: COLORS.PRIMARY,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 18,
    color: COLORS.TEXT,
    marginBottom: 16,
  },
  cryptoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoName: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.TEXT,
  },
  cryptoSymbol: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: COLORS.GRAY,
  },
  cryptoValues: {
    alignItems: 'flex-end',
  },
  cryptoPrice: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.TEXT,
  },
  cryptoChange: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickAccessItem: {
    width: '45%',
    aspectRatio: 1.5,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.TEXT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontFamily: FONTS.BOLD,
    fontSize: 14,
    color: COLORS.TEXT,
  },
});

export default HomeScreen;