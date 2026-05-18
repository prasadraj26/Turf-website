import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACdcyZK0f8kf9GpmP7WEhfz0T2dp997Kc",
  authDomain: "turf-booking-fb9a6.firebaseapp.com",
  projectId: "turf-booking-fb9a6",
  storageBucket: "turf-booking-fb9a6.firebasestorage.app",
  messagingSenderId: "376010474638",
  appId: "1:376010474638:web:2702e2f6b7cc5400d9f5df",
  measurementId: "G-RBDCZD8XHF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
