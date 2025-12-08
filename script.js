import { saveInventory, loadInventory, saveSale, loadSales, deleteAllSales } from './js/database.js';

// Base de datos local (solo unidades reales)
let inventory = {
    pilsen: { units: 0 },
    heineken: { units: 0 }
};

let sales = [];
let currentTab = 'inventory';

// Constantes
const BEERS_PER_BOX = 12;

// Inicializar al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    updateInventoryDisplay();
    updateSalesDisplay();
    updateTotals();
    setupSalePreview();
});

// Guardar datos en Firebase
async function saveData() {
    try {
        // Guardar inventario
        await saveInventory('pilsen', inventory.pilsen.units);
        await saveInventory('heineken', inventory.heineken.units);
        
        console.log('✅ Datos guardados en Firebase');
    } catch (error) {
        console.error('Error al guardar en Firebase:', error);
        showToast('Error al guardar datos', 'error');
    }
}

// Cargar datos desde Firebase
async function loadData() {
    try {
        // Cargar inventario
        const inventoryData = await loadInventory();
        inventory.pilsen.units = inventoryData.pilsen.units || 0;
        inventory.heineken.units = inventoryData.heineken.units || 0;

        // Cargar ventas
        sales = await loadSales();
        
        console.log('✅ Datos cargados desde Firebase');
    } catch (error) {
        console.error('Error al cargar desde Firebase:', error);
        showToast('Error al cargar datos', 'warning');
    }
}

// --- NUEVO SISTEMA DE INVENTARIO ---
// Cajas completas
function getBoxes(product) {
    return Math.floor(inventory[product].units / BEERS_PER_BOX);
}
// Unidades sueltas
function getLooseUnits(product) {
    return inventory[product].units % BEERS_PER_BOX;
}

// Cambiar entre tabs
window.switchTab = function(tabName) {
    currentTab = tabName;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
}

// --- AGREGAR STOCK ---
window.addStock = async function(product) {
    const unitsInput = document.getElementById(`${product}-add-units`);
    const boxesInput = document.getElementById(`${product}-add-boxes`);

    const units = parseInt(unitsInput.value) || 0;
    const boxes = parseInt(boxesInput.value) || 0;

    if (units === 0 && boxes === 0) {
        showToast('Ingrese al menos una cantidad', 'warning');
        return;
    }

    const totalUnits = units + (boxes * BEERS_PER_BOX);

    inventory[product].units += totalUnits;

    await saveData();
    updateInventoryDisplay();

    unitsInput.value = '';
    boxesInput.value = '';

    showToast(`Stock agregado correctamente`, 'success');
}

// --- MOSTRAR INVENTARIO ---
function updateInventoryDisplay() {
    document.getElementById('pilsen-units').textContent = getLooseUnits('pilsen');
    document.getElementById('pilsen-boxes').textContent = getBoxes('pilsen');

    document.getElementById('heineken-units').textContent = getLooseUnits('heineken');
    document.getElementById('heineken-boxes').textContent = getBoxes('heineken');
}

// Setup para preview de venta
function setupSalePreview() {
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('unit-price');

    const updatePreview = () => {
        const quantity = parseInt(quantityInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const total = quantity * price;

        document.getElementById('sale-preview').textContent = `S/ ${total.toFixed(2)}`;
    };

    quantityInput.addEventListener('input', updatePreview);
    priceInput.addEventListener('input', updatePreview);
}

// --- REGISTRAR VENTA ---
window.registerSale = async function() {
    const product = document.getElementById('product-select').value;
    const saleType = document.getElementById('sale-type').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = parseFloat(document.getElementById('unit-price').value);
    const paymentMethod = document.getElementById('payment-method').value;

    if (!quantity || quantity <= 0) {
        showToast('Ingrese una cantidad válida', 'error');
        return;
    }

    if (!unitPrice || unitPrice <= 0) {
        showToast('Ingrese un precio válido', 'error');
        return;
    }

    // Venta por unidad
    if (saleType === 'unit') {
        if (inventory[product].units < quantity) {
            showToast('Stock insuficiente', 'error');
            return;
        }
        inventory[product].units -= quantity;
    }
    // Venta por caja
    else {
        const unitsNeeded = quantity * BEERS_PER_BOX;

        if (inventory[product].units < unitsNeeded) {
            showToast('Stock insuficiente', 'error');
            return;
        }
        inventory[product].units -= unitsNeeded;
    }

    const total = quantity * unitPrice;

    const sale = {
        date: new Date().toISOString(),
        product: product,
        type: saleType,
        quantity: quantity,
        unitPrice: unitPrice,
        paymentMethod: paymentMethod,
        total: total
    };

    try {
        // Guardar venta en Firebase
        await saveSale(sale);
        
        // Actualizar inventario en Firebase
        await saveData();
        
        // Recargar ventas
        sales = await loadSales();
        
        updateInventoryDisplay();
        updateSalesDisplay();
        updateTotals();

        document.getElementById('quantity').value = '1';
        document.getElementById('unit-price').value = '';
        document.getElementById('payment-method').value = 'efectivo';
        document.getElementById('sale-preview').textContent = 'S/ 0.00';

        showToast(`Venta registrada: S/ ${total.toFixed(2)}`, 'success');

        setTimeout(() => {
            switchTab('history');
        }, 1500);
    } catch (error) {
        console.error('Error al registrar venta:', error);
        showToast('Error al registrar venta', 'error');
        // Revertir el cambio de inventario
        if (saleType === 'unit') {
            inventory[product].units += quantity;
        } else {
            inventory[product].units += (quantity * BEERS_PER_BOX);
        }
    }
}

// --- HISTORIAL DE VENTAS ---
function updateSalesDisplay() {
    const tbody = document.getElementById('sales-tbody');
    tbody.innerHTML = '';

    if (sales.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div class="py-12">
                        <div class="text-6xl mb-4">📋</div>
                        <p class="text-xl">No hay ventas registradas</p>
                        <p class="text-sm mt-2">Las ventas aparecerán aquí</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    sales.forEach(sale => {
        const row = document.createElement('tr');
        const date = new Date(sale.date);
        const formattedDate = date.toLocaleString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const productName = sale.product.charAt(0).toUpperCase() + sale.product.slice(1);
        const typeText = sale.type === 'unit' ? 'Unidad' : 'Caja';

        const paymentMethods = {
            efectivo: { text: 'Efectivo', icon: '💵', color: 'bg-green-500/20 text-green-300' },
            yape: { text: 'Yape', icon: '📱', color: 'bg-purple-500/20 text-purple-300' },
            fiado: { text: 'Fiado', icon: '📝', color: 'bg-orange-500/20 text-orange-300' }
        };

        const payment = paymentMethods[sale.paymentMethod] || paymentMethods.efectivo;

        row.innerHTML = `
            <td class="px-6 py-4">${formattedDate}</td>
            <td class="px-6 py-4">🍺 ${productName}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${sale.type === 'unit' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}">
                    ${typeText}
                </span>
            </td>
            <td class="px-6 py-4 font-semibold">${sale.quantity}</td>
            <td class="px-6 py-4">S/ ${sale.unitPrice.toFixed(2)}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${payment.color}">
                    ${payment.icon} ${payment.text}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="text-green-400 font-bold text-lg">S/ ${sale.total.toFixed(2)}</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// --- TOTALES ---
function updateTotals() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalToday = 0;
    let totalAll = 0;

    sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        saleDate.setHours(0, 0, 0, 0);

        totalAll += sale.total;

        if (saleDate.getTime() === today.getTime()) {
            totalToday += sale.total;
        }
    });

    document.getElementById('total-today').textContent = totalToday.toFixed(2);
    document.getElementById('total-all').textContent = totalAll.toFixed(2);
    document.getElementById('header-today').textContent = totalToday.toFixed(2);
    document.getElementById('total-sales-count').textContent = sales.length;
}

// Limpiar historial de ventas
window.clearSales = async function() {
    if (confirm('¿Está seguro de que desea eliminar todo el historial de ventas?\n\nEsta acción no se puede deshacer.')) {
        try {
            await deleteAllSales();
            sales = [];
            updateSalesDisplay();
            updateTotals();
            showToast('Historial de ventas eliminado', 'success');
        } catch (error) {
            console.error('Error al eliminar ventas:', error);
            showToast('Error al eliminar historial', 'error');
        }
    }
}

// Exportar ventas a CSV
window.exportSales = function() {
    if (sales.length === 0) {
        showToast('No hay ventas para exportar', 'warning');
        return;
    }

    let csv = 'Fecha,Hora,Producto,Tipo,Cantidad,Precio Unitario,Método de Pago,Total\n';

    sales.forEach(sale => {
        const date = new Date(sale.date);
        const dateStr = date.toLocaleDateString('es-PE');
        const timeStr = date.toLocaleTimeString('es-PE');
        const productName = sale.product.charAt(0).toUpperCase() + sale.product.slice(1);
        const type = sale.type === 'unit' ? 'Unidad' : 'Caja';

        const paymentTexts = {
            efectivo: 'Efectivo',
            yape: 'Yape',
            fiado: 'Fiado'
        };
        const paymentText = paymentTexts[sale.paymentMethod] || 'Efectivo';

        csv += `${dateStr},${timeStr},${productName},${type},${sale.quantity},${sale.unitPrice.toFixed(2)},${paymentText},${sale.total.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `ventas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Ventas exportadas correctamente', 'success');
}

// Mostrar toast
function showToast(message, type) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const messageEl = document.getElementById('toast-message');

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };

    icon.textContent = icons[type] || '📢';
    messageEl.textContent = message;

    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// --- MODAL PARA BORRAR STOCK ---
window.openDeleteModal = function(product) {
    document.getElementById("deleteStockModal").classList.remove("hidden");
    document.getElementById("deleteStockModal").setAttribute("data-product", product);
}

window.closeDeleteModal = function() {
    document.getElementById("deleteStockModal").classList.add("hidden");
    document.getElementById("remove-units-input").value = "";
    document.getElementById("remove-boxes-input").value = "";
}

// Confirmar borrado de stock
window.confirmRemoveStock = async function() {
    const product = document.getElementById("deleteStockModal").getAttribute("data-product");

    const units = parseInt(document.getElementById("remove-units-input").value) || 0;
    const boxes = parseInt(document.getElementById("remove-boxes-input").value) || 0;

    const totalToRemove = units + (boxes * BEERS_PER_BOX);

    if (totalToRemove <= 0) {
        showToast("Ingrese una cantidad válida", "warning");
        return;
    }

    if (inventory[product].units < totalToRemove) {
        showToast("No puedes borrar más stock del que tienes", "error");
        return;
    }

    inventory[product].units -= totalToRemove;

    await saveData();
    updateInventoryDisplay();
    closeDeleteModal();

    showToast("Stock eliminado correctamente", "success");
}
// -------------------------------
// 🔥 FUNCIONES DE RESTAURACIÓN
// -------------------------------

import { restoreInventory, restoreSales } from "./js/restore.js";

// 🔄 Restaurar INVENTARIO desde backup
window.restoreInventoryFromBackup = async function () {
    try {
        await restoreInventory();
        showToast("Inventario restaurado correctamente", "success");
        setTimeout(() => location.reload(), 1000);
    } catch (error) {
        console.error("Error al restaurar inventario:", error);
        showToast("Error al restaurar inventario", "error");
    }
};

// 💾 Restaurar VENTAS desde backup
window.restoreSalesFromBackup = async function () {
    try {
        await restoreSales();
        showToast("Ventas restauradas correctamente", "success");
        setTimeout(() => location.reload(), 1000);
    } catch (error) {
        console.error("Error al restaurar ventas:", error);
        showToast("Error al restaurar ventas", "error");
    }
};

// ⚠️ Restaurar TODO (Inventario + Ventas)
window.restoreAllSystem = async function () {
    try {
        await restoreInventory();
        await restoreSales();
        showToast("Sistema restaurado por completo", "success");
        setTimeout(() => location.reload(), 1200);
    } catch (error) {
        console.error("Error al restaurar todo el sistema:", error);
        showToast("Error al restaurar el sistema", "error");
    }
};
// --------------------------------------
// 🔐 MODAL SECRETO DE ADMINISTRADOR
// --------------------------------------

const ADMIN_PIN = "12345"; // Cambia este PIN cuando quieras

// Detectar clics en el icono 🍺
const headerIcon = document.getElementById("secretAdminBtn");

headerIcon.addEventListener("click", () => {
    openAdminModal();
});


window.openAdminModal = function () {
    document.getElementById("adminModal").classList.remove("hidden");
};

window.closeAdminModal = function () {
    document.getElementById("adminModal").classList.add("hidden");
    document.getElementById("adminPinInput").value = "";
};

window.validateAdminPin = function () {
    const input = document.getElementById("adminPinInput").value;

    if (input === ADMIN_PIN) {
        closeAdminModal();
        openRestoreModal();
    } else {
        showToast("PIN incorrecto", "error");
    }
};

// --------------------------------------
// 🛠 MODAL DE RESTAURACIÓN
// --------------------------------------

window.openRestoreModal = function () {
    document.getElementById("restoreModal").classList.remove("hidden");
};

window.closeRestoreModal = function () {
    document.getElementById("restoreModal").classList.add("hidden");
};
