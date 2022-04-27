import { firebase } from "@react-native-firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "***********************************",
    authDomain: "***********************************",
    databaseURL: "***********************************",
    projectId: "***********************************",
    storageBucket: "***********************************",
    messagingSenderId: "***********************************",
    appId: "***********************************",
    measurementId: "***********************************"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

