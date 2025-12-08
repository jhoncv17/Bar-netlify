import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

/*
  ----------------------------------------------------
  📌 SISTEMA DE RESTAURACIÓN DE DATOS DESDE BACKUPS
  ----------------------------------------------------
  Contiene funciones para restaurar:

  ✔ Inventario (desde inventory_backup)
  ✔ Ventas (desde sales_backup)
  ✔ Restauración total del sistema
*/

// ----------------------------------------------------
// 🔄 RESTAURAR INVENTARIO DESDE BACKUP
// ----------------------------------------------------
export async function restoreInventory() {
  const backups = await getDocs(collection(db, "inventory_backup"));
  let restoredInventory = {};

  backups.forEach(docu => {
    const data = docu.data();
    restoredInventory[data.product] = { units: data.units };
  });

  // Guardar en inventario real
  for (let product in restoredInventory) {
    await setDoc(doc(db, "inventory", product), restoredInventory[product]);
  }

  return restoredInventory;
}

// ----------------------------------------------------
// 🔄 RESTAURAR VENTAS DESDE BACKUP
// ----------------------------------------------------
export async function restoreSales() {
  const backups = await getDocs(collection(db, "sales_backup"));

  let restoredCount = 0;

  backups.forEach(async (docu) => {
    const data = docu.data();

    // Guardar nuevamente como venta real
    await addDoc(collection(db, "sales"), {
      date: data.date,
      product: data.product,
      type: data.type,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      paymentMethod: data.paymentMethod,
      total: data.total
    });

    restoredCount++;
  });

  return restoredCount;
}

// ----------------------------------------------------
// 🔄 RESTAURAR TODO EL SISTEMA (Inventario + Ventas)
// ----------------------------------------------------
export async function restoreEverything() {
  const restoredInventory = await restoreInventory();
  const restoredSalesCount = await restoreSales();

  return {
    inventory: restoredInventory,
    salesRestored: restoredSalesCount
  };
}
