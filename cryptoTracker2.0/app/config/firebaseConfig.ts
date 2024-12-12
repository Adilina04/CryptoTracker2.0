import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyApquhOvyWee9MTRSy2D7hQFjapB2AY2iQ",
  authDomain: "cryptotracker-1d6cd.firebaseapp.com",
  projectId: "cryptotracker-1d6cd",
  storageBucket: "cryptotracker-1d6cd.firebasestorage.app",
  messagingSenderId: "52025988070",
  appId: "1:52025988070:web:3c53694d2114866b04fc27",
  measurementId: "G-62TR7Y6PVK",
};


let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);


let analytics = null;
const initAnalytics = async () => {
  try {
    if (await isSupported()) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.log("Analytics not supported on this platform");
  }
};

initAnalytics();

export { analytics };
export default app;