import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAEd_5DBpwa6RrkplsEONXFE1y5EnwkYM",
    authDomain: "bar-system-ea669.firebaseapp.com",
    projectId: "bar-system-ea669",
    storageBucket: "bar-system-ea669.appspot.com",
    messagingSenderId: "417609327472",
    appId: "1:417609327472:web:ef317dc17ef1113ecea5b5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const firestore = {
    doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs
};
