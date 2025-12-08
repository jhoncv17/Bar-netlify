import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// -------------------------------
// 🔥 BACKUP AUTOMÁTICO (AGREGADO)
// -------------------------------

// Guarda copia del inventario cada vez que se actualiza
async function backupInventory(product, units) {
  await addDoc(collection(db, "inventory_backup"), {
    product: product,
    units: units,
    timestamp: new Date()
  });
}

// Guarda copia de cada venta
async function backupSale(sale) {
  await addDoc(collection(db, "sales_backup"), {
    ...sale,
    timestamp: new Date()
  });
}

// -------------------------------
// 🔥 INVENTARIO
// -------------------------------

// Guarda las unidades de un producto
export async function saveInventory(product, units) {
  await setDoc(doc(db, "inventory", product), {
    units: units
  });

  // BACKUP AUTOMÁTICO
  await backupInventory(product, units);
}

// Obtiene inventario completo
export async function loadInventory() {
  const pilsen = await getDoc(doc(db, "inventory", "pilsen"));
  const heineken = await getDoc(doc(db, "inventory", "heineken"));

  return {
    pilsen: pilsen.exists() ? pilsen.data() : { units: 0 },
    heineken: heineken.exists() ? heineken.data() : { units: 0 }
  };
}

// -------------------------------
// 🔥 VENTAS
// -------------------------------

// Registrar venta
export async function saveSale(sale) {
  await addDoc(collection(db, "sales"), sale);

  // BACKUP AUTOMÁTICO
  await backupSale(sale);
}

// Cargar ventas
export async function loadSales() {
  const querySnap = await getDocs(collection(db, "sales"));
  let list = [];

  querySnap.forEach(docu => {
    list.push({
      id: docu.id,
      ...docu.data()
    });
  });

  // Ordenar por fecha descendente
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Borrar TODAS las ventas
export async function deleteAllSales() {
  const querySnap = await getDocs(collection(db, "sales"));

  for (let d of querySnap.docs) {
    await deleteDoc(doc(db, "sales", d.id));
  }
}
