// src/firebase.js
import { initializeApp } from "firebase/app";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "myexpensetracker-6fed6.firebaseapp.com",
  projectId: "myexpensetracker-6fed6",
  storageBucket: "myexpensetracker-6fed6.appspot.com",
  messagingSenderId: "1046720930332",
  appId: "1:1046720930332:web:bf10405201b0f073ca75d9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
