// IMPORTAR SDK DESDE CDN (compatible con HTML puro)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
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
