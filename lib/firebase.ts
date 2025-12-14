import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton pattern for Firebase initialization
let app: FirebaseApp;
let database: Database;

/**
 * Initialize Firebase app (only once)
 * Following Singleton pattern to prevent multiple initializations
 */
function initializeFirebase(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
}

/**
 * Get Firebase app instance
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeFirebase();
  }
  return app;
}

/**
 * Get Firebase Realtime Database instance
 */
export function getFirebaseDatabase(): Database {
  if (!database) {
    const app = getFirebaseApp();
    database = getDatabase(app);
  }
  return database;
}

// Export initialized instances
export const firebaseApp = getFirebaseApp();
export const db = getFirebaseDatabase();
