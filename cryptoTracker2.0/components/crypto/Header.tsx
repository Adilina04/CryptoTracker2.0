import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../utils/constants';

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  const handleSettings = () => {
    Alert.alert('Coming Soon', 'Settings feature will be available soon!');
  };

  return (
    <View style={styles.headerContent}>
      <View style={styles.userSection}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.emailText}>{userEmail}</Text>
      </View>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleSettings}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.ERROR} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  userSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
    color: COLORS.GRAY,
  },
  emailText: {
    fontSize: 16,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
});

export default Header;
