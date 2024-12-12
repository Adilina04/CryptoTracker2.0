import AsyncStorage from "@react-native-async-storage/async-storage";

export const DEBUG_MODE = __DEV__;

export const debugStorage = {
  logStorageContent: async () => {
    if (DEBUG_MODE) {
      try {
        const users = await AsyncStorage.getItem('users');
        const currentUser = await AsyncStorage.getItem('currentUser');
        
        console.group('Auth Debug Info');
        console.log('Users:', users ? JSON.parse(users) : 'No users found');
        console.log('Current User:', currentUser ? JSON.parse(currentUser) : 'No current user');
        console.groupEnd();
      } catch (error) {
        console.error('Storage Debug Error:', error);
      }
    }
  }
};