import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '@/utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

type IoniconsNames = keyof typeof Ionicons.glyphMap;

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  rightIcon?: IoniconsNames;
  onRightPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showSettings = false,
  rightIcon,
  onRightPress
}) => {
  const router = useRouter();

  const handleSettingsPress = () => {
    router.push('/screens/main/SettingsScreen');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/screens/main/HomeScreen');
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity 
              onPress={handleBack}
              style={styles.iconButton}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.TEXT} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>

        <View style={styles.rightContainer}>
          {showSettings && (
            <TouchableOpacity 
              onPress={handleSettingsPress}
              style={styles.iconButton}
            >
              <Ionicons name="settings-outline" size={24} color={COLORS.TEXT} />
            </TouchableOpacity>
          )}
          {rightIcon && (
            <TouchableOpacity 
              onPress={onRightPress}
              style={[styles.iconButton, styles.rightIcon]}
            >
              <Ionicons name={rightIcon} size={24} color={COLORS.TEXT} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    flex: 1,
    fontFamily: FONTS.BOLD,
    fontSize: 18,
    color: COLORS.TEXT,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Header;