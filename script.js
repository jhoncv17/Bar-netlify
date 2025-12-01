import {
  saveInventory,
  loadInventory,
  saveSale,
  loadSales,
  deleteAllSales
} from "./database.js";

// ---------------------------------------------------------------------
// 🔥 VARIABLES GLOBALES DEL SISTEMA
// ---------------------------------------------------------------------

let inventory = {
  pilsen: 0,
  heineken: 0
};

let cart = []; // Carrito temporal
let productCatalog = document.getElementById("productCatalog");
let cartItemsContainer = document.getElementById("cartItems");
let totalPriceElement = document.getElementById("totalPrice");

// ---------------------------------------------------------------------
// 🔥 CARGAR INVENTARIO DESDE FIREBASE
// ---------------------------------------------------------------------

async function initializeInventory() {
  const data = await loadInventory();

  inventory.pilsen = data.pilsen.units;
  inventory.heineken = data.heineken.units;

  updateInventoryUI();
}

// Actualizar UI del inventario
function updateInventoryUI() {
  document.getElementById("pilsenUnits").innerText = inventory.pilsen;
  document.getElementById("heinekenUnits").innerText = inventory.heineken;
}

// ---------------------------------------------------------------------
// 🔥 GUARDAR INVENTARIO EN FIREBASE
// ---------------------------------------------------------------------

document.getElementById("updateInventoryBtn")?.addEventListener("click", async () => {
  let pilsen = parseInt(document.getElementById("pilsenInput").value);
  let heineken = parseInt(document.getElementById("heinekenInput").value);

  inventory.pilsen += pilsen;
  inventory.heineken += heineken;

  await saveInventory("pilsen", inventory.pilsen);
  await saveInventory("heineken", inventory.heineken);

  updateInventoryUI();
  alert("Inventario actualizado correctamente");
});

// ---------------------------------------------------------------------
// 🔥 PRODUCTOS DISPONIBLES
// ---------------------------------------------------------------------

const products = {
  pilsen: {
    name: "Cerveza Pilsen",
    price: 10.00,
    img: "../img/pilsen.jpg"
  },

  heineken: {
    name: "Cerveza Heineken",
    price: 12.00,
    img: "../img/heineken.jpg"
  }
};

// ---------------------------------------------------------------------
// 🔥 MOSTRAR PRODUCTOS EN EL CATÁLOGO
// ---------------------------------------------------------------------

if (productCatalog) {
  Object.keys(products).forEach((key) => {
    const p = products[key];
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = `
      <img src="${p.img}">
      <h3>${p.name}</h3>
      <p>S/ ${p.price.toFixed(2)}</p>
      <button onclick="addToCart('${key}')">Agregar</button>
    `;

    productCatalog.appendChild(div);
  });
}

// ---------------------------------------------------------------------
// 🔥 AÑADIR AL CARRITO
// ---------------------------------------------------------------------

window.addToCart = function (productKey) {
  const product = products[productKey];

  if (inventory[productKey] <= 0) {
    alert("No hay stock disponible.");
    return;
  }

  cart.push(product);
  inventory[productKey]--;

  updateCartUI();
  updateInventoryUI();
};

// ---------------------------------------------------------------------
// 🔥 MOSTRAR CARRITO
// ---------------------------------------------------------------------

function updateCartUI() {
  cartItemsContainer.innerHTML = "";

  cart.forEach((p, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p>${p.name} - S/ ${p.price.toFixed(2)}</p>
      <button onclick="removeFromCart(${index})">Quitar</button>
      <hr>
    `;

    cartItemsContainer.appendChild(div);
  });

  let total = cart.reduce((sum, p) => sum + p.price, 0);
  totalPriceElement.innerText = total.toFixed(2);
}

// ---------------------------------------------------------------------
// 🔥 QUITAR ITEM DEL CARRITO
// ---------------------------------------------------------------------

window.removeFromCart = function (index) {
  const product = cart[index];

  inventory[getKeyFromProduct(product)]++;

  cart.splice(index, 1);

  updateCartUI();
  updateInventoryUI();
};

function getKeyFromProduct(product) {
  return Object.keys(products).find(key => products[key].name === product.name);
}

// ---------------------------------------------------------------------
// 🔥 PROCESAR VENTA Y GUARDAR EN FIREBASE
// ---------------------------------------------------------------------

document.getElementById("completeSaleBtn")?.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const saleData = {
    items: cart.map(p => p.name),
    total: total,
    date: new Date().toISOString()
  };

  await saveSale(saleData);

  alert("Venta registrada con éxito");

  cart = [];
  updateCartUI();
});

// ---------------------------------------------------------------------
// 🔥 CARGAR HISTORIAL DE VENTAS
// ---------------------------------------------------------------------

async function updateSalesHistory() {
  const sales = await loadSales();
  const container = document.getElementById("salesHistory");

  container.innerHTML = "";

  sales.forEach((sale) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p><strong>${new Date(sale.date).toLocaleString()}</strong></p>
      <p>Items: ${sale.items.join(", ")}</p>
      <p>Total: S/ ${sale.total.toFixed(2)}</p>
      <hr>
    `;

    container.appendChild(div);
  });
}

// ---------------------------------------------------------------------
// 🔥 BORRAR TODO EL HISTORIAL
// ---------------------------------------------------------------------

document.getElementById("deleteHistoryBtn")?.addEventListener("click", async () => {
  await deleteAllSales();
  alert("Todo el historial fue eliminado.");
  updateSalesHistory();
});

// ---------------------------------------------------------------------
// 🔥 INICIALIZACIÓN GENERAL
// ---------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  await initializeInventory();

  if (document.getElementById("salesHistory")) {
    await updateSalesHistory();
  }
});
