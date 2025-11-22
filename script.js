// Base de datos local
let inventory = {
    pilsen: { units: 0, boxes: 0 },
    heineken: { units: 0, boxes: 0 }
};

let sales = [];
let currentTab = 'inventory';

// Constantes
const BEERS_PER_BOX = 12;

// Inicializar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateInventoryDisplay();
    updateSalesDisplay();
    updateTotals();
    setupSalePreview();
});

// Guardar datos en localStorage
function saveData() {
    localStorage.setItem('beerInventory', JSON.stringify(inventory));
    localStorage.setItem('beerSales', JSON.stringify(sales));
}

// Cargar datos de localStorage
function loadData() {
    const savedInventory = localStorage.getItem('beerInventory');
    const savedSales = localStorage.getItem('beerSales');
    
    if (savedInventory) {
        inventory = JSON.parse(savedInventory);
    }
    
    if (savedSales) {
        sales = JSON.parse(savedSales);
    }
}

// Cambiar entre tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
}

// Agregar stock
function addStock(product) {
    const unitsInput = document.getElementById(`${product}-add-units`);
    const boxesInput = document.getElementById(`${product}-add-boxes`);
    
    const units = parseInt(unitsInput.value) || 0;
    const boxes = parseInt(boxesInput.value) || 0;
    
    if (units === 0 && boxes === 0) {
        showToast('Ingrese al menos una cantidad', 'warning');
        return;
    }
    
    inventory[product].units += units;
    inventory[product].boxes += boxes;
    
    saveData();
    updateInventoryDisplay();
    
    unitsInput.value = '';
    boxesInput.value = '';
    
    const productName = product.charAt(0).toUpperCase() + product.slice(1);
    showToast(`Stock agregado: ${productName}`, 'success');
}

// Actualizar display de inventario
function updateInventoryDisplay() {
    document.getElementById('pilsen-units').textContent = inventory.pilsen.units;
    document.getElementById('pilsen-boxes').textContent = inventory.pilsen.boxes;
    document.getElementById('heineken-units').textContent = inventory.heineken.units;
    document.getElementById('heineken-boxes').textContent = inventory.heineken.boxes;
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

// Registrar venta
function registerSale() {
    const product = document.getElementById('product-select').value;
    const saleType = document.getElementById('sale-type').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = parseFloat(document.getElementById('unit-price').value);
    
    // Validaciones
    if (!quantity || quantity <= 0) {
        showToast('Ingrese una cantidad válida', 'error');
        return;
    }
    
    if (!unitPrice || unitPrice <= 0) {
        showToast('Ingrese un precio válido', 'error');
        return;
    }
    
    // Verificar stock disponible
    if (saleType === 'unit') {
        if (inventory[product].units < quantity) {
            showToast('Stock insuficiente de unidades', 'error');
            return;
        }
        inventory[product].units -= quantity;
    } else { // box
        if (inventory[product].boxes < quantity) {
            showToast('Stock insuficiente de cajas', 'error');
            return;
        }
        inventory[product].boxes -= quantity;
    }
    
    // Calcular total
    const total = quantity * unitPrice;
    
    // Crear registro de venta
    const sale = {
        id: Date.now(),
        date: new Date().toISOString(),
        product: product,
        type: saleType,
        quantity: quantity,
        unitPrice: unitPrice,
        total: total
    };
    
    sales.unshift(sale); // Agregar al inicio
    
    saveData();
    updateInventoryDisplay();
    updateSalesDisplay();
    updateTotals();
    
    // Limpiar formulario
    document.getElementById('quantity').value = '1';
    document.getElementById('unit-price').value = '';
    document.getElementById('sale-preview').textContent = 'S/ 0.00';
    
    showToast(`Venta registrada: S/ ${total.toFixed(2)}`, 'success');
    
    // Cambiar a tab de historial después de 1.5 segundos
    setTimeout(() => {
        switchTab('history');
    }, 1500);
}

// Actualizar display de ventas
function updateSalesDisplay() {
    const tbody = document.getElementById('sales-tbody');
    tbody.innerHTML = '';
    
    if (sales.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
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
                <span class="text-green-400 font-bold text-lg">S/ ${sale.total.toFixed(2)}</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Actualizar totales
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
function clearSales() {
    if (confirm('¿Está seguro de que desea eliminar todo el historial de ventas?\n\nEsta acción no se puede deshacer.')) {
        sales = [];
        saveData();
        updateSalesDisplay();
        updateTotals();
        showToast('Historial de ventas eliminado', 'success');
    }
}

// Exportar ventas a CSV
function exportSales() {
    if (sales.length === 0) {
        showToast('No hay ventas para exportar', 'warning');
        return;
    }
    
    let csv = 'Fecha,Hora,Producto,Tipo,Cantidad,Precio Unitario,Total\n';
    
    sales.forEach(sale => {
        const date = new Date(sale.date);
        const dateStr = date.toLocaleDateString('es-PE');
        const timeStr = date.toLocaleTimeString('es-PE');
        const productName = sale.product.charAt(0).toUpperCase() + sale.product.slice(1);
        const type = sale.type === 'unit' ? 'Unidad' : 'Caja';
        
        csv += `${dateStr},${timeStr},${productName},${type},${sale.quantity},${sale.unitPrice.toFixed(2)},${sale.total.toFixed(2)}\n`;
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

// Mostrar toast notification
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