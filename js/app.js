import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const ref = await addDoc(collection(db, "prueba"), {
            mensaje: "Firebase funciona correctamente!",
            fecha: new Date()
        });

        console.log("Documento escrito con ID:", ref.id);
    } catch (error) {
        console.error("Error: ", error);
    }
});
