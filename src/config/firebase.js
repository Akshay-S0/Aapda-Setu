import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: " ",
  authDomain: "aapdasetu-c0ce1.firebaseapp.com",
  databaseURL: " ",
  projectId: "aapdasetu-c0ce1",
  storageBucket: "aapdasetu-c0ce1.firebasestorage.app",
  messagingSenderId: " ", // You'll need to update this
  appId: " " // You'll need to update this
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
