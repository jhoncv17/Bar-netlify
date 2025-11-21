import { supabase, IGV_RATE, formatCurrency } from './supabase-client.js'

let cart = []
let products = []

export async function initProductCatalog() {
    await loadProducts()
    loadCart()
    setupEventListeners()
    renderProducts(products)
    updateCartDisplay()
}

async function loadProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name')

        if (error) throw error
        products = data
    } catch (error) {
        console.error('Error loading products:', error)
        showToast('Error al cargar productos', 'error')
    }
}

function setupEventListeners() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn')
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.getElementById('mobileMenu')?.classList.toggle('hidden')
        })
    }

    document.getElementById('brandFilter')?.addEventListener('change', applyFilters)
    document.getElementById('stockFilter')?.addEventListener('change', applyFilters)
    document.getElementById('priceFilter')?.addEventListener('change', applyFilters)
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters)
    document.getElementById('checkoutBtn')?.addEventListener('click', proceedToCheckout)
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart)
    document.getElementById('mobileCartBtn')?.addEventListener('click', openMobileCart)
    document.getElementById('closeMobileCart')?.addEventListener('click', closeMobileCart)
    document.getElementById('mobileCheckoutBtn')?.addEventListener('click', proceedToCheckout)
}

function renderProducts(productsToRender) {
    const grid = document.getElementById('productGrid')
    const emptyState = document.getElementById('emptyState')

    if (!grid) return

    if (productsToRender.length === 0) {
        grid.innerHTML = ''
        emptyState?.classList.remove('hidden')
        return
    }

    emptyState?.classList.add('hidden')

    grid.innerHTML = productsToRender.map(product => {
        const stockStatus = getStockStatus(product)
        const stockBadgeClass = stockStatus === 'out-of-stock' ? 'badge-error' :
                               stockStatus === 'low-stock' ? 'badge-warning' : 'badge-success'
        const stockText = stockStatus === 'out-of-stock' ? 'Sin Stock' :
                         stockStatus === 'low-stock' ? 'Stock Bajo' : 'En Stock'

        return `
            <div class="card hover-lift overflow-hidden">
                <div class="relative h-48 overflow-hidden bg-gray-100">
                    <img src="${product.image_url}"
                         alt="${product.description}"
                         class="w-full h-full object-cover"
                         loading="lazy">
                    <div class="absolute top-3 right-3">
                        <span class="badge ${stockBadgeClass}">${stockText}</span>
                    </div>
                    ${product.stock <= product.low_stock_threshold && product.stock > 0 ? `
                        <div class="absolute top-3 left-3">
                            <span class="badge badge-warning">
                                <svg class="w-3 h-3 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                Ultimas unidades
                            </span>
                        </div>
                    ` : ''}
                </div>
                <div class="p-4">
                    <div class="mb-3">
                        <h3 class="font-heading font-bold text-lg text-primary mb-1">${product.name}</h3>
                        <p class="text-sm text-text-secondary">${product.description}</p>
                    </div>
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            ${product.unit_price ? `
                                <div class="text-sm text-text-secondary">Unidad</div>
                                <div class="font-heading font-bold text-xl text-primary">${formatCurrency(product.unit_price)}</div>
                            ` : ''}
                            ${product.case_price ? `
                                <div class="text-sm text-text-secondary mt-1">Caja (12 uds)</div>
                                <div class="font-heading font-bold text-lg text-secondary">${formatCurrency(product.case_price)}</div>
                            ` : ''}
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-text-secondary">Stock</div>
                            <div class="font-mono font-bold text-lg ${product.stock <= product.low_stock_threshold ? 'text-warning' : 'text-success'}">${product.stock}</div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        ${product.unit_price && product.stock > 0 ? `
                            <button onclick="window.addToCart('${product.id}', 'unit')"
                                    class="btn-primary w-full py-2 text-sm">
                                Añadir Unidad
                            </button>
                        ` : ''}
                        ${product.case_price && product.stock >= 12 ? `
                            <button onclick="window.addToCart('${product.id}', 'case')"
                                    class="btn-secondary w-full py-2 text-sm">
                                Añadir Caja
                            </button>
                        ` : ''}
                        ${product.stock === 0 ? `
                            <button disabled class="btn-outline w-full py-2 text-sm opacity-50 cursor-not-allowed">
                                Sin Stock
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `
    }).join('')
}

function getStockStatus(product) {
    if (product.stock === 0) return 'out-of-stock'
    if (product.stock <= product.low_stock_threshold) return 'low-stock'
    return 'in-stock'
}

function applyFilters() {
    const brandValue = document.getElementById('brandFilter')?.value
    const stockValue = document.getElementById('stockFilter')?.value
    const priceValue = document.getElementById('priceFilter')?.value

    let filtered = products.filter(product => {
        if (brandValue !== 'all' && product.brand !== brandValue) return false

        if (stockValue !== 'all') {
            const status = getStockStatus(product)
            if (stockValue !== status) return false
        }

        if (priceValue !== 'all') {
            const price = product.unit_price || product.case_price
            const [min, max] = priceValue.split('-').map(p => p.replace('+', ''))
            const minPrice = parseFloat(min)
            const maxPrice = max ? parseFloat(max) : Infinity

            if (price < minPrice || price > maxPrice) return false
        }

        return true
    })

    renderProducts(filtered)
}

function resetFilters() {
    document.getElementById('brandFilter').value = 'all'
    document.getElementById('stockFilter').value = 'all'
    document.getElementById('priceFilter').value = 'all'
    renderProducts(products)
}

window.addToCart = function(productId, type) {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const quantity = type === 'case' ? 12 : 1
    const price = type === 'case' ? product.case_price : product.unit_price

    if (product.stock < quantity) {
        showToast('Stock insuficiente', 'error')
        return
    }

    const existingItem = cart.find(item => item.productId === productId && item.type === type)

    if (existingItem) {
        existingItem.quantity += 1
        existingItem.totalQuantity += quantity
    } else {
        cart.push({
            productId,
            name: product.name,
            type,
            price: parseFloat(price),
            quantity: 1,
            totalQuantity: quantity,
            image: product.image_url
        })
    }

    saveCart()
    updateCartDisplay()
    showToast(`${product.name} añadido al carrito`, 'success')
}

window.removeFromCart = function(index) {
    cart.splice(index, 1)
    saveCart()
    updateCartDisplay()
}

window.updateCartQuantity = function(index, change) {
    const item = cart[index]
    const product = products.find(p => p.id === item.productId)

    if (!product) return

    const newQuantity = item.quantity + change
    const newTotalQuantity = item.totalQuantity + (change * (item.type === 'case' ? 12 : 1))

    if (newQuantity <= 0) {
        removeFromCart(index)
        return
    }

    if (newTotalQuantity > product.stock) {
        showToast('Stock insuficiente', 'error')
        return
    }

    item.quantity = newQuantity
    item.totalQuantity = newTotalQuantity

    saveCart()
    updateCartDisplay()
}

function updateCartDisplay() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * IGV_RATE
    const total = subtotal + tax

    document.getElementById('cartCount').textContent = cartCount
    document.getElementById('mobileCartCount').textContent = cartCount
    document.getElementById('subtotal').textContent = formatCurrency(subtotal)
    document.getElementById('tax').textContent = formatCurrency(tax)
    document.getElementById('total').textContent = formatCurrency(total)
    document.getElementById('mobileTotal').textContent = formatCurrency(total)

    const hasItems = cart.length > 0
    document.getElementById('checkoutBtn').disabled = !hasItems
    document.getElementById('mobileCheckoutBtn').disabled = !hasItems

    renderCartItems()
}

function renderCartItems() {
    const desktopCart = document.getElementById('cartItems')
    const mobileCart = document.getElementById('mobileCartItems')

    const emptyCartHTML = `
        <div class="text-center py-8">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/>
            </svg>
            <p class="text-text-secondary text-sm">Tu carrito está vacío</p>
        </div>
    `

    if (cart.length === 0) {
        desktopCart.innerHTML = emptyCartHTML
        mobileCart.innerHTML = emptyCartHTML
        return
    }

    const cartHTML = cart.map((item, index) => `
        <div class="flex gap-3 mb-4 pb-4 border-b border-border last:border-0">
            <img src="${item.image}"
                 alt="${item.name}"
                 class="w-16 h-16 object-cover rounded-base flex-shrink-0"
                 loading="lazy">
            <div class="flex-1 min-w-0">
                <h4 class="font-medium text-sm text-text-primary truncate">${item.name}</h4>
                <p class="text-xs text-text-secondary">${item.type === 'case' ? 'Caja (12 uds)' : 'Unidad'}</p>
                <p class="font-bold text-primary mt-1">${formatCurrency(item.price)}</p>
                <div class="flex items-center gap-2 mt-2">
                    <button onclick="window.updateCartQuantity(${index}, -1)"
                            class="btn-ghost p-1 rounded-base">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                    <span class="font-mono text-sm font-medium px-2">${item.quantity}</span>
                    <button onclick="window.updateCartQuantity(${index}, 1)"
                            class="btn-ghost p-1 rounded-base">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                    <button onclick="window.removeFromCart(${index})"
                            class="btn-ghost p-1 rounded-base text-error ml-auto">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('')

    desktopCart.innerHTML = cartHTML
    mobileCart.innerHTML = cartHTML
}

function clearCart() {
    if (cart.length === 0) return

    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = []
        saveCart()
        updateCartDisplay()
        showToast('Carrito vaciado', 'info')
    }
}

function proceedToCheckout() {
    if (cart.length === 0) return
    localStorage.setItem('checkoutCart', JSON.stringify(cart))
    window.location.href = 'sales_checkout.html'
}

function openMobileCart() {
    document.getElementById('mobileCartModal')?.classList.remove('hidden')
}

function closeMobileCart() {
    document.getElementById('mobileCartModal')?.classList.add('hidden')
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast')
    const toastMessage = document.getElementById('toastMessage')
    const toastIcon = document.getElementById('toastIcon')

    if (!toast || !toastMessage || !toastIcon) return

    const icons = {
        success: '<svg class="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
        error: '<svg class="w-6 h-6 text-error" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
        info: '<svg class="w-6 h-6 text-info" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
    }

    toastIcon.innerHTML = icons[type] || icons.success
    toastMessage.textContent = message

    toast.classList.remove('hidden')

    setTimeout(() => {
        toast.classList.add('hidden')
    }, 3000)
}

function saveCart() {
    localStorage.setItem('beerStoreCart', JSON.stringify(cart))
}

function loadCart() {
    const saved = localStorage.getItem('beerStoreCart')
    if (saved) {
        try {
            cart = JSON.parse(saved)
        } catch (e) {
            console.error('Error loading cart:', e)
            cart = []
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initProductCatalog()
})
