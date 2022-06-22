
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCMszm0msU5FrtUfZ2lk2iX_PpklGbX2-0",
  authDomain: "repair-temp.firebaseapp.com",
  projectId: "repair-temp",
  storageBucket: "repair-temp.appspot.com",
  messagingSenderId: "771630027553",
  appId: "1:771630027553:web:11a093985dc82f68892460"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore();