import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6gs6jkglC3HbIncJTaoZiDhHViPSMYRg",
  authDomain: "milkshakereviews-eb811.firebaseapp.com",
  projectId: "milkshakereviews-eb811",
  storageBucket: "milkshakereviews-eb811.firebasestorage.app",
  messagingSenderId: "852019938708",
  appId: "1:852019938708:web:00b6aa670402455b4cfb81",
  measurementId: "G-B1X8QB13S6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);