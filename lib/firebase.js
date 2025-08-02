// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


const firebaseConfig ={
  apiKey: "AIzaSyBBUqyW5VBXMnFVu2I41_c8HCdQ7O9T88w",
  authDomain: "garuda-nextjs-98b70.firebaseapp.com",
  projectId: "garuda-nextjs-98b70",
  storageBucket: "garuda-nextjs-98b70.firebasestorage.app",
  messagingSenderId: "775115944646",
  appId: "1:775115944646:web:2a18a159a6f3f4a4b35dc7",
  measurementId: "G-TB5YE02FYH"
};

// Prevent re-initialization in development (Next.js hot reload)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)

