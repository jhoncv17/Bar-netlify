// IMPORTAR SDK DESDE CDN (compatible con HTML puro)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

// Firestore (base de datos)
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

// Authentication (si lo usas más adelante)
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// CONFIGURACIÓN QUE TE DIO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAEd_5DBpwa6RrkplsEONXFE1y5EnwkYM",
    authDomain: "bar-system-ea669.firebaseapp.com",
    projectId: "bar-system-ea669",
    storageBucket: "bar-system-ea669.appspot.com",
    messagingSenderId: "417609327472",
    appId: "1:417609327472:web:ef317dc17ef1113ecea5b5"
};

// INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);

// EXPORTAR BASE DE DATOS Y AUTH PARA USARLOS EN OTROS ARCHIVOS
export const db = getFirestore(app);
export const auth = getAuth(app);

// EXPORTAR TODAS LAS FUNCIONES FIRESTORE QUE TU script.js NECESITA
export const firestore = {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs
};
