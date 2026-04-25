import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:0:web:0",
};

/** True when all public Firebase web config values are set (not placeholder). */
export function isFirebaseConfigValid(): boolean {
  return (
    Boolean(firebaseConfig.projectId) &&
    Boolean(firebaseConfig.authDomain) &&
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey !== "placeholder"
  );
}

function getApp(): FirebaseApp {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

const app = getApp();

export const db: Firestore = getFirestore(app);

let _auth: Auth | null = null;
export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(app);
  return _auth;
}

export const auth = new Proxy({} as Auth, {
  get(_, prop: string) {
    const real = getFirebaseAuth();
    const val = (real as unknown as Record<string, unknown>)[prop];
    return typeof val === "function" ? val.bind(real) : val;
  },
});

export const storage: FirebaseStorage = getStorage(app);
export default app;
