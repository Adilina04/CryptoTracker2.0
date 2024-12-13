import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { COLORS, FONTS } from '../../../utils/constants';
import Header from '@/components/Header';

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    loadUserData();
    checkBiometricSettings();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkBiometricSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      setBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error checking biometric settings:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['currentUser', 'biometricEnabled']);
            router.replace('/screens/auth/LoginScreen');
          }
        }
      ]
    );
  };

  const toggleBiometric = async (value: boolean) => {
    try {
      if (value) {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) {
          Alert.alert('Error', 'Biometric authentication is not available on this device');
          return;
        }

        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
          Alert.alert('Error', 'No biometrics enrolled on this device');
          return;
        }

        await AsyncStorage.setItem('biometricEnabled', 'true');
        setBiometricEnabled(true);
      } else {
        await AsyncStorage.setItem('biometricEnabled', 'false');
        setBiometricEnabled(false);
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
      Alert.alert('Error', 'Failed to toggle biometric authentication');
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    hasSwitch, 
    value, 
    onValueChange,
    onPress,
    subtitle
  }: {
    icon: string;
    title: string;
    hasSwitch?: boolean;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
    subtitle?: string;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color={COLORS.PRIMARY} />
        </View>
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {hasSwitch && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.GRAY, true: COLORS.PRIMARY }}
          thumbColor={COLORS.WHITE}
        />
      )}
      {onPress && (
        <Ionicons name="chevron-forward" size={24} color={COLORS.GRAY} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Settings" showBack />
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon="person-outline"
            title="Profile"
            subtitle={currentUser?.email}
            onPress={() => {}}
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Change Password"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <SettingItem
            icon="finger-print"
            title="Biometric Authentication"
            hasSwitch
            value={biometricEnabled}
            onValueChange={toggleBiometric}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            hasSwitch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            hasSwitch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon="information-circle-outline"
            title="App Info"
            onPress={() => {}}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => {}}
          />
          <SettingItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.WHITE,
    marginBottom: 1,
    borderRadius: 12,
    marginVertical: 4,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.TEXT,
  },
  settingSubtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.ERROR,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 48,
  },
  logoutText: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.WHITE,
  },
});

export default SettingsScreen;