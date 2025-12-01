// Firebase CDN compatible con HTML
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// 🔥 TUS DATOS DE FIREBASE (ya me los pasaste)
const firebaseConfig = {
  apiKey: "AIzaSyAEd_5DBpwa6RrkplsEONXFE1y5EnwkYM",
  authDomain: "bar-system-ea669.firebaseapp.com",
  projectId: "bar-system-ea669",
  storageBucket: "bar-system-ea669.appspot.com",
  messagingSenderId: "417609327472",
  appId: "1:417609327472:web:ef317dc17ef1113ecea5b5"
};

// Inicializar
const app = initializeApp(firebaseConfig);

// Exportar base de datos
export const db = getFirestore(app);
