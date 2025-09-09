import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3NCAxFl3qfnvATk_KxZaAC4el1zbv0F8",
  authDomain: "aapdasetu-c0ce1.firebaseapp.com",
  databaseURL: "https://aapdasetu-c0ce1-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "aapdasetu-c0ce1",
  storageBucket: "aapdasetu-c0ce1.firebasestorage.app",
  messagingSenderId: "199744637798", // You'll need to update this
  appId: "1:199744637798:web:e4d96c09f69ee12519d6a7" // You'll need to update this
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
