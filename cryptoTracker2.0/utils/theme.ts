import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './constants';

export const theme = {
  async toggleDarkMode(value: boolean) {
    try {
      await AsyncStorage.setItem('darkMode', value.toString());
      return value;
    } catch (error) {
      console.error('Error saving theme:', error);
      return false;
    }
  },

  async getDarkMode(): Promise<boolean> {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      return darkMode === 'true';
    } catch (error) {
      console.error('Error loading theme:', error);
      return false;
    }
  },

  getColors(darkMode: boolean) {
    return {
      background: darkMode ? COLORS.DARK_BACKGROUND : COLORS.BACKGROUND,
      text: darkMode ? COLORS.WHITE : COLORS.TEXT,
      card: darkMode ? '#1E1E1E' : COLORS.WHITE,
      border: darkMode ? '#2D2D2D' : COLORS.BORDER,
    };
  }
};