
// State
let cart = [];
let tableNumber = null;
let activeCategory = 'All';
let searchTerm = '';
let selectedMethod = '';
let currentOrderData = null; // Store order data for payment confirmation
let isSubmitting = false; // Prevent double submit

// Configuration
const CARSS_CONFIG = {
    venue: {
        name: "Iyarà Side Restaurant",
        theme: "iyara-dark",
        logo_url: "assets/logo.png"
    },
    whatsapp: {
        phone: "2349014596269",
        base_url: "https://wa.me/"
    },
    bank: {
        bankName: "Access Bank",
        accountNumber: "0123456789",
        accountName: "Iyarà Side Restaurant",
        transferNote: "Use Order ID as ref"
    },
    features: {
        lounge_mode: false, // Toggles service pipelines
        require_transfer_metadata: true, // Forces user to input sender name
        table_reconfirm_ms: 60 * 60 * 1000 // 1 hour (Ask "Still here?" after 1h)
    },
    table_ttl_ms: 6 * 60 * 60 * 1000 // 6 hours
};
const MAX_TABLE_NUMBER = 999;

// DOM Elements
const menuGrid = document.getElementById('menu-grid');
const categoryList = document.getElementById('category-list');
const searchInput = document.getElementById('search-input');
const cartDrawer = document.getElementById('cart-drawer');
const cartPanel = document.getElementById('cart-panel');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutTableInput = document.getElementById('checkout-table');
const welcomeModal = document.getElementById('welcome-modal');
const welcomeTableInput = document.getElementById('welcome-table-input');
const welcomeContinueBtn = document.getElementById('welcome-continue-btn');

// --- Initialization ---

function init() {
    // A1: Table number priority with URL override
    // A2: Check table TTL (6 hour expiry)
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    const sessionTable = sessionStorage.getItem('tableNumber');
    const sessionTimestamp = sessionStorage.getItem('tableSetAt');

    // Validate and parse URL table param
    const urlTable = validateTableNumber(tableParam);

    // Check if session table is expired
    const isSessionExpired = sessionTimestamp &&
        (Date.now() - parseInt(sessionTimestamp)) > CARSS_CONFIG.table_ttl_ms;

    if (isSessionExpired) {
        // Clear expired session
        sessionStorage.removeItem('tableNumber');
        sessionStorage.removeItem('tableSetAt');
    }

    const validSessionTable = !isSessionExpired ? validateTableNumber(sessionTable) : null;

    // Priority logic: URL overrides session
    if (urlTable && validSessionTable && urlTable !== validSessionTable) {
        // Show switch table prompt
        showSwitchTablePrompt(validSessionTable, urlTable);
        return; // Exit early, let user decide
    } else if (urlTable) {
        // Valid URL param, use it
        saveTableNumber(urlTable);
        setTableNumberUI(urlTable);
    } else if (validSessionTable) {
        // Valid session, use it
        tableNumber = validSessionTable;
        setTableNumberUI(validSessionTable);
    } else {
        // No valid table - show welcome modal
        showWelcomeModal();
    }

    renderCategories();
    renderMenu();
    renderMenu();
    updateCartUI();
    hydrateAppsConfig();

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderMenu();
    });

    // Welcome modal input validation
    welcomeTableInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        welcomeContinueBtn.disabled = !value || parseInt(value) < 1;
    });

    // Allow Enter key to submit table number
    welcomeTableInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !welcomeContinueBtn.disabled) {
            confirmTableNumber();
        }
    });

    // A8: Stale Table Check
    checkTableStaleness();
}

// --- Table Number Management ---

// A1: Helper to validate table number (1-999)
function validateTableNumber(value) {
    if (!value) return null;
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > MAX_TABLE_NUMBER) return null;
    return num.toString();
}

// A2: Save table with timestamp for TTL
function saveTableNumber(table) {
    tableNumber = table;
    sessionStorage.setItem('tableNumber', table);
    sessionStorage.setItem('tableSetAt', Date.now().toString());

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('table', table);
    window.history.pushState({}, '', url);
}

// A1: Show switch table confirmation prompt
function showSwitchTablePrompt(currentTable, newTable) {
    const modal = document.getElementById('switch-table-modal');
    document.getElementById('switch-current-table').textContent = currentTable;
    document.getElementById('switch-new-table').textContent = newTable;
    document.getElementById('switch-new-table-btn').textContent = newTable;
    document.getElementById('switch-current-table-btn').textContent = currentTable;

    // Store for button handlers
    modal.dataset.currentTable = currentTable;
    modal.dataset.newTable = newTable;

    modal.classList.remove('hidden');

    // Focus on Switch button (primary action)
    setTimeout(() => {
        document.getElementById('switch-to-new-btn')?.focus();
    }, 100);
}

function showWelcomeModal() {
    welcomeModal.classList.remove('hidden');
    setTimeout(() => {
        welcomeTableInput.focus();
    }, 100);
}

function confirmTableNumber() {
    const value = validateTableNumber(welcomeTableInput.value.trim());
    if (!value) return;

    saveTableNumber(value);
    setTableNumberUI(value);
    welcomeModal.classList.add('hidden');
}

function setTableNumberUI(table) {
    document.getElementById('table-banner').classList.remove('hidden');
    document.getElementById('table-banner-text').textContent = `YOU ARE AT TABLE ${table}`;
    document.getElementById('cart-table-display').textContent = `TABLE ${table}`;
    document.getElementById('cart-table-display').classList.remove('hidden');
    checkoutTableInput.value = table;
}


// --- Menu Rendering ---

function renderCategories() {
    const categories = ['All', ...new Set(ALL_DISHES.map(d => d.category))];
    categoryList.innerHTML = categories.map(cat => `
        <button onclick="setCategory('${cat}')" 
            class="whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-brand-green text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200'}">
            ${cat}
        </button>
    `).join('');
}

function setCategory(cat) {
    activeCategory = cat;
    renderCategories(); // Re-render to update active state
    renderMenu();
}

function renderMenu() {
    const filtered = ALL_DISHES.filter(dish => {
        const matchesCat = activeCategory === 'All' || dish.category === activeCategory;
        const matchesSearch = dish.name.toLowerCase().includes(searchTerm) || dish.description.toLowerCase().includes(searchTerm);
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        menuGrid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-400 font-serif text-xl">Sorry, no items match your taste.</div>`;
        return;
    }

    menuGrid.innerHTML = filtered.map(dish => `
        <div class="bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 hover:-translate-y-2">
            <div class="h-64 overflow-hidden relative">
                <img src="${dish.image}" alt="${dish.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ${dish.tags ? dish.tags.map((tag, i) => `<span class="absolute top-4 left-4 bg-brand-gold text-brand-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md" style="left: ${16 + (i * 70)}px">${tag}</span>`).join('') : ''}
            </div>
            <div class="p-8">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-serif text-brand-green leading-tight font-bold">${dish.name}</h3>
                    <p class="text-brand-gold font-black text-lg whitespace-nowrap ml-2">₦${dish.price.toLocaleString()}</p>
                </div>
                <p class="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">${dish.description}</p>
                <div class="flex items-center gap-3">
                    <button onclick="addToCart('${dish.id}')" class="flex-1 bg-brand-green text-white py-4 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-brand-green">
                        ADD TO ORDER
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- Cart Logic ---

function addToCart(dishId) {
    const dish = ALL_DISHES.find(d => d.id === dishId);
    if (!dish) return;

    const existing = cart.find(item => item.id === dishId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...dish, quantity: 1 });
    }
    updateCartUI();
    // Visual feedback could be added here
    toggleCart(true);
}

function updateQuantity(dishId, delta) {
    const item = cart.find(i => i.id === dishId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== dishId);
        }
    }
    updateCartUI();
}

function removeFromCart(dishId) {
    cart = cart.filter(i => i.id !== dishId);
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Update Header
    document.getElementById('cart-count-btn').textContent = `Cart (${totalItems})`;
    document.getElementById('cart-total-btn').textContent = `₦${totalPrice.toLocaleString()}`;
    document.getElementById('cart-total-display').textContent = `₦${totalPrice.toLocaleString()}`;
    document.getElementById('checkout-total').textContent = `₦${totalPrice.toLocaleString()}`;

    // Render Items
    const cartItemsContainer = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-gray-400">
                <i data-lucide="shopping-bag" class="w-12 h-12 mb-4 opacity-20"></i>
                <p>Your cart is empty.</p>
                <button onclick="toggleCart(false)" class="mt-4 text-brand-gold font-bold underline">Start Ordering</button>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex gap-4 border-b border-gray-100 pb-6">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-2xl object-cover" />
            <div class="flex-grow">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-brand-green w-3/4">${item.name}</h4>
                    <button onclick="removeFromCart('${item.id}')" class="text-gray-300 hover:text-red-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
                <p class="text-brand-gold font-bold text-sm mt-1">₦${(item.price * item.quantity).toLocaleString()}</p>
                <div class="flex items-center gap-4 mt-3">
                    <div class="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button onclick="updateQuantity('${item.id}', -1)" class="p-1 hover:bg-gray-200 rounded"><i data-lucide="minus" class="w-3 h-3"></i></button>
                        <span class="px-3 font-bold text-xs">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" class="p-1 hover:bg-gray-200 rounded"><i data-lucide="plus" class="w-3 h-3"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

// --- Modal Logic ---

function toggleCart(show) {
    if (show) {
        cartDrawer.classList.remove('hidden');
        setTimeout(() => {
            cartPanel.classList.remove('translate-x-full');
        }, 10);
    } else {
        cartPanel.classList.add('translate-x-full');
        setTimeout(() => {
            cartDrawer.classList.add('hidden');
        }, 300);
    }
}

function openCheckout() {
    toggleCart(false);
    checkoutModal.classList.remove('hidden');
    selectedMethod = '';
    document.getElementById('selected-payment').value = '';
    updatePaymentButtons();
}

function closeCheckout() {
    checkoutModal.classList.add('hidden');
    resetSubmitState(); // Always reset on checkout close
}

function selectPayment(method) {
    selectedMethod = method;
    document.getElementById('selected-payment').value = method;
    updatePaymentButtons();
}

function updatePaymentButtons() {
    const methods = ['POS', 'CASH', 'TRANSFER'];
    methods.forEach(m => {
        const btn = document.getElementById(`pay-${m.toLowerCase()}`);
        if (m === selectedMethod) {
            btn.classList.add('border-brand-gold', 'bg-brand-gold/10', 'text-brand-dark');
            btn.classList.remove('border-gray-200', 'text-gray-400');
        } else {
            btn.classList.remove('border-brand-gold', 'bg-brand-gold/10', 'text-brand-dark');
            btn.classList.add('border-gray-200', 'text-gray-400');
        }
    });
}

// --- Submit State Management ---

/**
 * Reset submit button state to allow new orders.
 * Called from all modal exit paths to prevent permanent "Processing..." lock.
 */
function resetSubmitState() {
    isSubmitting = false;

    // Find and reset the confirm button
    const confirmBtn = document.querySelector('#checkout-modal button[type="submit"]');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'CONFIRM ORDER';
    }
}

// --- Checkout Logic ---

function callWaiter() {
    const phone = CARSS_CONFIG.whatsapp.phone;
    const msg = tableNumber
        ? `Hello, I'm at Table #${tableNumber} and I need assistance.`
        : `Hello, I am at the restaurant and need assistance from a waiter.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function submitOrder(e) {
    e.preventDefault();
    const finalTable = checkoutTableInput.value;

    // Validation with user feedback
    if (!selectedMethod) {
        alert('Please select a payment method (POS, Cash, or Bank Transfer)');
        return;
    }

    if (!finalTable) {
        alert('Please enter your table number');
        return;
    }

    // A3: Prevent double submit
    if (isSubmitting) return;
    isSubmitting = true;

    // Disable button and show processing state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> Processing...`;
        lucide.createIcons();
    }

    // Failsafe: Auto-reset after 20 seconds if something goes wrong
    const failsafeTimeout = setTimeout(() => {
        resetSubmitState();
        alert('Something went wrong. Please try again.');
        console.error('Submit timeout - state auto-reset');
    }, 20000);

    try {
        const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // A7: Improved order ID format: ORD-YYMMDD-HHMMSS-XXX
        const orderId = generateOrderId();

        // Store order data for payment confirmation
        currentOrderData = {
            orderId,
            table: finalTable,
            method: selectedMethod,
            total: totalPrice,
            items: [...cart]
        };

        // Clear the failsafe since we're proceeding normally
        clearTimeout(failsafeTimeout);

        // Close checkout modal (will call resetSubmitState)
        closeCheckout();

        // Show payment-specific confirmation
        showPaymentConfirmation(selectedMethod, currentOrderData);
    } catch (error) {
        // Error handling - reset state
        clearTimeout(failsafeTimeout);
        resetSubmitState();
        alert('Failed to process order. Please try again.');
        console.error('Submit order error:', error);
    }
}

function showPaymentConfirmation(method, orderData) {
    const modalId = `${method.toLowerCase()}-confirmation-modal`;
    const modal = document.getElementById(modalId);

    if (!modal) return;

    // Populate modal with order data
    document.getElementById(`${method.toLowerCase()}-table`).textContent = orderData.table;
    document.getElementById(`${method.toLowerCase()}-order-id`).textContent = orderData.orderId;
    document.getElementById(`${method.toLowerCase()}-total`).textContent = `₦${orderData.total.toLocaleString()}`;

    // Prevent body scroll (mobile-first fix)
    document.body.classList.add('modal-open');

    // Show modal
    modal.classList.remove('hidden');

    // Re-init icons for the new modal
    lucide.createIcons();

    // Send WhatsApp message immediately (background)
    sendWhatsAppOrder(orderData);
}

// A7: Generate collision-resistant order ID
function generateOrderId() {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const hh = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${yy}${mm}${dd}-${hh}${min}${ss}-${rand}`;
}

// Anti-Abuse: Simple hash for order integrity
function generateOrderSignature(orderData) {
    const raw = `${orderData.orderId}-${orderData.total}-${orderData.table}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Return positive hex string
    return Math.abs(hash).toString(16).toUpperCase().slice(0, 6);
}

// A6: Build WhatsApp message with standardized payment status
function buildWhatsAppMessage(orderData) {
    const methodMap = {
        POS: '💳 POS Terminal',
        CASH: '💵 Cash',
        TRANSFER: '🏦 Bank Transfer'
    };
    const methodText = methodMap[orderData.method];

    // A6: Standardized payment status lines
    const paymentStatus = (orderData.method === 'POS' || orderData.method === 'CASH')
        ? '✅ Payment: Pay at table'
        : '⏳ Payment: Awaiting transfer';

    // Format message with clear structure
    const header = `🔔 *NEW ORDER*%0A%0A`;
    const tableInfo = `📍 *TABLE ${orderData.table}*%0A`;
    const paymentInfo = `${methodText}%0A`;
    const orderIdInfo = `🆔 Order ID: ${orderData.orderId}%0A`;
    const statusInfo = `${paymentStatus}%0A%0A`;

    // Anti-Abuse: Add Sender Metadata if Transfer
    let metadataInfo = '';
    if (orderData.method === 'TRANSFER' && orderData.metadata) {
        metadataInfo = `👤 Sender: ${orderData.metadata.senderName}%0A💰 Sent: ₦${orderData.metadata.amountSent}%0A%0A`;
    }

    const divider = `────────────────%0A`;

    const itemsText = orderData.items.map(item =>
        `• ${item.quantity}x ${item.name}%0A   ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('%0A');

    const totalText = `%0A${divider}💰 *TOTAL: ₦${orderData.total.toLocaleString()}*`;

    // Anti-Abuse: Add Signature
    const signature = generateOrderSignature(orderData);
    const sigText = `%0A%0A🔐 [SIG: ${signature}]`;

    return `${header}${tableInfo}${paymentInfo}${orderIdInfo}${statusInfo}${metadataInfo}${itemsText}${totalText}${sigText}%0A%0A${paymentStatus}`;
}

function sendWhatsAppOrder(orderData) {
    // Anti-Abuse: Mandatory Transfer Metadata Check
    if (orderData.method === 'TRANSFER') {
        const senderName = document.getElementById('transfer-sender-name').value.trim();
        const amountSent = document.getElementById('transfer-amount-sent').value.trim();

        if (CARSS_CONFIG.features.require_transfer_metadata) {
            if (!senderName) {
                alert('Please enter the Sender Name for verification.');
                document.getElementById('transfer-sender-name').focus();
                return;
            }
            // Attach metadata to order object for message building
            orderData.metadata = {
                senderName: senderName,
                amountSent: amountSent || '0'
            };
        }
    }

    const phone = CARSS_CONFIG.whatsapp.phone;
    const message = buildWhatsAppMessage(orderData);
    window.open(`${CARSS_CONFIG.whatsapp.base_url}${phone}?text=${message}`, '_blank');
}

function closePaymentConfirmation() {
    // Hide all confirmation modals
    document.getElementById('pos-confirmation-modal').classList.add('hidden');
    document.getElementById('cash-confirmation-modal').classList.add('hidden');
    document.getElementById('transfer-confirmation-modal').classList.add('hidden');

    // Restore body scroll
    document.body.classList.remove('modal-open');

    // Reset submit state (uses centralized helper)
    resetSubmitState();

    // Clear cart and reset
    cart = [];
    currentOrderData = null;
    updateCartUI();
}

// A4: Copy message to clipboard
function copyOrderMessage() {
    if (!currentOrderData) return;

    const message = buildWhatsAppMessage(currentOrderData);
    const plainText = message.replace(/%0A/g, '\n').replace(/%20/g, ' ');

    navigator.clipboard.writeText(plainText).then(() => {
        showToast('Copied ✅');
    }).catch(() => {
        showToast('Copy failed');
    });
}

// A5: Copy transfer details
function copyTransferDetail(type) {
    let text = '';
    if (type === 'account') {
        text = CARSS_CONFIG.bank.accountNumber;
    } else if (type === 'orderId' && currentOrderData) {
        text = currentOrderData.orderId;
    }

    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied ✅');
    }).catch(() => {
        showToast('Copy failed');
    });
}

// A4: Show toast notification
function showToast(message) {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 2000);
}

// --- Config Hydration ---
function hydrateAppsConfig() {
    // Inject Venue Details
    if (CARSS_CONFIG.venue && CARSS_CONFIG.venue.name) {
        document.title = CARSS_CONFIG.venue.name;
        document.querySelectorAll('[data-config="venue.name"]').forEach(el => el.textContent = CARSS_CONFIG.venue.name);
    }

    // Inject Bank Details
    document.querySelectorAll('[data-config="bank.bankName"]').forEach(el => el.textContent = CARSS_CONFIG.bank.bankName);
    document.querySelectorAll('[data-config="bank.accountNumber"]').forEach(el => el.textContent = CARSS_CONFIG.bank.accountNumber);
    document.querySelectorAll('[data-config="bank.accountName"]').forEach(el => el.textContent = CARSS_CONFIG.bank.accountName);
}

// --- Stale Table Logic ---

function checkTableStaleness() {
    // If feature disabled, exit
    // if (!CARSS_CONFIG.features.table_reconfirm_ms) return; 

    // Init already handles hard expiry. This is for "Are you still there?"
    const sessionTable = sessionStorage.getItem('tableNumber');
    const sessionTimestamp = sessionStorage.getItem('tableSetAt');

    // Only check if we have a session but NO URL override (URL override already confirmed via showSwitchTablePrompt)
    const params = new URLSearchParams(window.location.search);
    if (params.get('table')) return;

    if (sessionTable && sessionTimestamp) {
        const elapsed = Date.now() - parseInt(sessionTimestamp);
        if (elapsed > CARSS_CONFIG.features.table_reconfirm_ms) {
            showReconfirmTableModal(sessionTable);
        }
    }
}

function showReconfirmTableModal(table) {
    document.getElementById('reconfirm-table-number').textContent = `Table ${table}`;
    document.getElementById('reconfirm-table-modal').classList.remove('hidden');
}

function confirmStaleTable() {
    // Refresh timestamp
    const table = sessionStorage.getItem('tableNumber');
    if (table) saveTableNumber(table);
    document.getElementById('reconfirm-table-modal').classList.add('hidden');
}

function resetStaleTable() {
    // Clear session and show welcome
    sessionStorage.removeItem('tableNumber');
    sessionStorage.removeItem('tableSetAt');
    document.getElementById('reconfirm-table-modal').classList.add('hidden');

    // Clear UI
    document.getElementById('table-banner').classList.add('hidden');
    document.getElementById('cart-table-display').classList.add('hidden');

    showWelcomeModal();
}

// Start
init();
