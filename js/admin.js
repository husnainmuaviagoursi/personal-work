// ==========================================================================
// HUSNAIN FASHION - Admin Dashboard Client Controller
// ==========================================================================

let adminToken = localStorage.getItem('hf_admin_token') || null;
let currentProducts = [];
let currentOffers = [];
let currentOrders = [];
let currentCustomers = [];
let selectedViewingOrderId = null;

// Category to Subcategory map
const SUBCATEGORIES_MAP = {
    shirts: [
        { id: 'casual-shirts', name: 'Casual Shirts' },
        { id: 'formal-shirts', name: 'Formal Shirts' },
        { id: 'polo-shirts', name: 'Polo Shirts' },
        { id: 'cotton-shirts', name: 'Cotton Shirts' },
        { id: 'printed-shirts', name: 'Printed Shirts' }
    ],
    trousers: [
        { id: 'formal-trousers', name: 'Formal Trousers' },
        { id: 'casual-trousers', name: 'Casual Trousers' },
        { id: 'chinos', name: 'Chinos' },
        { id: 'cotton-trousers', name: 'Cotton Trousers' },
        { id: 'jeans', name: 'Denim Jeans' }
    ],
    'coats-winter': [
        { id: 'wool-coats', name: 'Wool Coats' },
        { id: 'blazers', name: 'Tailored Blazers' },
        { id: 'winter-coats', name: 'Winter Coats & Parkas' },
        { id: 'jackets', name: 'Jackets & Suede' },
        { id: 'formal-coats', name: 'Formal Overcoats' }
    ]
};

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    checkAdminAuth();
    updateSubCategories();
    setDefaultOfferDates();
});

// --------------------------------------------------------------------------
// Theme Toggle Engine (Black & White Operation)
// --------------------------------------------------------------------------
function initTheme() {
    let saved = localStorage.getItem('hf_theme_v2');
    if (!saved) {
        saved = 'light';
        localStorage.setItem('hf_theme_v2', 'light');
        localStorage.setItem('hf_theme', 'light');
    } else {
        saved = localStorage.getItem('hf_theme') || 'light';
    }
    applyTheme(saved);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hf_theme', theme);
    localStorage.setItem('hf_theme_v2', theme);

    // Update icons
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(ic => {
        if (theme === 'light') {
            ic.className = 'fa-solid fa-sun theme-toggle-icon';
        } else {
            ic.className = 'fa-solid fa-moon theme-toggle-icon';
        }
    });

    const labels = document.querySelectorAll('.theme-toggle-label');
    labels.forEach(lb => {
        lb.textContent = theme === 'light' ? 'White' : 'Black';
    });

    const floatingLabels = document.querySelectorAll('.floating-bw-label');
    floatingLabels.forEach(fl => {
        fl.textContent = theme === 'light' ? 'White ⚪ (Go Black)' : 'Black ⚫ (Go White)';
    });

    // Update Segmented B&W Switcher pill buttons
    const bwSwitchers = document.querySelectorAll('.bw-theme-switcher');
    bwSwitchers.forEach(sw => {
        const whiteBtn = sw.querySelector('.btn-opt-white');
        const blackBtn = sw.querySelector('.btn-opt-black');
        if (whiteBtn && blackBtn) {
            if (theme === 'light') {
                whiteBtn.classList.add('active');
                blackBtn.classList.remove('active');
            } else {
                whiteBtn.classList.remove('active');
                blackBtn.classList.add('active');
            }
        }
    });
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
}

// --------------------------------------------------------------------------
// Mobile Sidebar Controls
// --------------------------------------------------------------------------
function toggleAdminSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const backdrop = document.getElementById('adminSidebarBackdrop');
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('open', isOpen);
}

function closeAdminSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const backdrop = document.getElementById('adminSidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    }
}

// --------------------------------------------------------------------------
// Admin Authentication
// --------------------------------------------------------------------------
async function checkAdminAuth() {
    if (!adminToken) {
        showLoginScreen();
        return;
    }

    try {
        const res = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.success) {
            showDashboard();
            loadAllAdminData();
        } else {
            showLoginScreen();
        }
    } catch (e) {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('adminLoginScreen').style.display = 'flex';
    document.getElementById('adminDashboardApp').style.display = 'none';
}

function showDashboard() {
    document.getElementById('adminLoginScreen').style.display = 'none';
    document.getElementById('adminDashboardApp').style.display = 'flex';
}

async function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();

    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            adminToken = data.token;
            localStorage.setItem('hf_admin_token', adminToken);
            showDashboard();
            loadAllAdminData();
        } else {
            alert('Authentication Failed: ' + (data.error || 'Invalid credentials'));
        }
    } catch (e) {
        alert('Could not reach authentication server');
    }
}

function adminLogout() {
    localStorage.removeItem('hf_admin_token');
    adminToken = null;
    showLoginScreen();
}

// --------------------------------------------------------------------------
// Tab Navigation
// --------------------------------------------------------------------------
function switchAdminTab(tabId, el) {
    document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    if (el) el.classList.add('active');
    closeAdminSidebar();

    const titleEl = document.getElementById('tabHeaderTitle');
    const subEl = document.getElementById('tabHeaderSubtitle');

    switch (tabId) {
        case 'overviewTab':
            titleEl.textContent = 'Overview & Analytics';
            subEl.textContent = 'Real-time revenue, order metrics and inventory status';
            loadStats();
            break;
        case 'productsTab':
            titleEl.textContent = 'Products Management';
            subEl.textContent = 'Manage shirts, trousers, winter coats, blazers and prices';
            loadProducts();
            break;
        case 'offersTab':
            titleEl.textContent = 'Special Offers & Coupons';
            subEl.textContent = 'Create Buy 1 Get 1 Free, Buy 2 10% OFF, Buy 3 20% OFF and seasonal coupons';
            loadOffers();
            break;
        case 'ordersTab':
            titleEl.textContent = 'Customer Orders';
            subEl.textContent = 'Process nationwide delivery consignments via TCS / Leopards Courier';
            loadOrders();
            break;
        case 'customersTab':
            titleEl.textContent = 'Registered Customers';
            subEl.textContent = 'Real customer profiles, contact numbers, order counts and total spend';
            loadCustomers();
            break;
    }
}

// --------------------------------------------------------------------------
// Data Fetching
// --------------------------------------------------------------------------
async function loadAllAdminData() {
    await Promise.all([
        loadStats(),
        loadProducts(),
        loadOffers(),
        loadOrders(),
        loadCustomers()
    ]);
}

async function loadStats() {
    try {
        const res = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.success) {
            const { totalRevenue, totalOrders, totalProducts, totalCustomers, recentOrders } = data.stats;
            document.getElementById('kpiRevenue').textContent = `Rs. ${totalRevenue.toLocaleString()}`;
            document.getElementById('kpiOrders').textContent = totalOrders.toLocaleString();
            document.getElementById('kpiProducts').textContent = totalProducts.toLocaleString();
            document.getElementById('kpiCustomers').textContent = totalCustomers.toLocaleString();

            renderRecentOrders(recentOrders || []);
        }
    } catch (e) {
        console.error('Error loading stats:', e);
    }
}

function renderRecentOrders(orders) {
    const tbody = document.getElementById('overviewRecentOrdersTable');
    if (!tbody) return;

    if (!orders.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No orders placed yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => `
        <tr>
            <td><strong style="color: var(--gold-light);">${o.id}</strong></td>
            <td>${o.customer_name}<br><small style="color: var(--text-muted);">${o.customer_phone}</small></td>
            <td>${o.city}</td>
            <td><strong>Rs. ${o.grand_total.toLocaleString()}</strong></td>
            <td><span style="font-size: 0.8rem; color: #2ecc71;">${o.payment_method}</span></td>
            <td><span class="status-pill ${o.order_status}">${o.order_status}</span></td>
            <td>
                <button class="btn-outline btn-sm" onclick="viewOrderDetails('${o.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

// --------------------------------------------------------------------------
// Products Management
// --------------------------------------------------------------------------
async function loadProducts() {
    try {
        const res = await fetch('/api/admin/products', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.success) {
            currentProducts = data.products;
            filterAdminProducts();
        }
    } catch (e) {
        console.error('Error loading products:', e);
    }
}

function filterAdminProducts() {
    const query = (document.getElementById('adminProductSearch')?.value || '').toLowerCase().trim();
    const cat = document.getElementById('adminCategoryFilter')?.value || 'all';
    const season = document.getElementById('adminSeasonFilter')?.value || 'all';

    let filtered = [...currentProducts];

    if (query) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
    }
    if (cat !== 'all') {
        filtered = filtered.filter(p => p.category === cat);
    }
    if (season !== 'all') {
        filtered = filtered.filter(p => p.season === season || p.season === 'all-season');
    }

    renderProductsTable(filtered);
}

function renderProductsTable(products) {
    const tbody = document.getElementById('adminProductsTableBody');
    if (!tbody) return;

    if (!products.length) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2rem;">No products match your criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => {
        const firstImg = (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80';
        const colorsHtml = (p.colors || []).map(c => `
            <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${c.hex}; border: 1px solid #fff; margin-right: 2px;" title="${c.name}"></span>
        `).join('');
        const sizesHtml = (p.sizes || []).join(', ');

        return `
            <tr>
                <td><img src="${firstImg}" class="table-thumb" alt="${p.name}"></td>
                <td>
                    <strong>${p.name}</strong><br>
                    <small style="color: var(--gold-light);">${p.id}</small>
                </td>
                <td>
                    <span style="text-transform: capitalize;">${p.category}</span><br>
                    <small style="color: var(--text-muted);">${p.sub_category.replace(/-/g, ' ')}</small>
                </td>
                <td><span style="text-transform: capitalize;">${p.season}</span></td>
                <td>
                    <strong style="color: var(--gold-bright);">Rs. ${p.discount_price.toLocaleString()}</strong><br>
                    <small style="text-decoration: line-through; color: var(--text-dim);">Rs. ${p.original_price.toLocaleString()}</small>
                </td>
                <td>${colorsHtml || '-'}</td>
                <td><small>${sizesHtml || '-'}</small></td>
                <td>
                    <span class="status-pill ${p.is_active ? 'active' : 'inactive'}">
                        ${p.is_active ? 'Active' : 'Hidden'}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.4rem;">
                        <button class="btn-outline btn-sm" onclick="openEditProductModal('${p.id}')" title="Edit">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-outline btn-sm btn-danger" onclick="confirmDeleteProduct('${p.id}')" title="Delete">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateSubCategories() {
    const catSelect = document.getElementById('prodCategory');
    const subSelect = document.getElementById('prodSubCategory');
    if (!catSelect || !subSelect) return;

    const cat = catSelect.value;
    const subs = SUBCATEGORIES_MAP[cat] || [];

    subSelect.innerHTML = subs.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

function addColorRow(name = '', hex = '#111111') {
    const container = document.getElementById('colorsListContainer');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'color-row-item';
    row.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';
    row.innerHTML = `
        <input type="text" class="color-name-input" placeholder="Color Name (e.g. Navy Blue)" value="${name}" style="flex: 2;" required>
        <input type="color" class="color-hex-input" value="${hex}" style="width: 50px; height: 38px; padding: 2px; cursor: pointer;">
        <button type="button" class="btn-outline btn-sm btn-danger" onclick="this.parentElement.remove()" title="Remove color">&times;</button>
    `;
    container.appendChild(row);
}

function openAddProductModal() {
    document.getElementById('productForm').reset();
    document.getElementById('prodEditId').value = '';
    document.getElementById('productModalTitle').textContent = 'Add New Garment';
    document.getElementById('colorsListContainer').innerHTML = '';
    
    // Add 2 default colors
    addColorRow('Pure White', '#ffffff');
    addColorRow('Midnight Navy', '#131e33');

    updateSubCategories();
    openAdminModal('productModal');
}

function openEditProductModal(id) {
    const p = currentProducts.find(x => x.id === id);
    if (!p) return;

    document.getElementById('prodEditId').value = p.id;
    document.getElementById('productModalTitle').textContent = `Edit Garment: ${p.id}`;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCategory').value = p.category;
    updateSubCategories();
    document.getElementById('prodSubCategory').value = p.sub_category;
    document.getElementById('prodSeason').value = p.season;
    document.getElementById('prodBadge').value = p.discount_badge || '';
    document.getElementById('prodOriginalPrice').value = p.original_price;
    document.getElementById('prodDiscountPrice').value = p.discount_price;
    document.getElementById('prodImageUrl').value = (p.images && p.images[0]) || '';
    document.getElementById('prodFabric').value = p.fabric || '';
    document.getElementById('prodFit').value = p.fit || '';
    document.getElementById('prodCare').value = p.care || '';
    document.getElementById('prodDesc').value = p.description || '';

    // Sizes
    document.querySelectorAll('input[name="prodSizes"]').forEach(cb => {
        cb.checked = (p.sizes || []).includes(cb.value);
    });

    // Colors
    const container = document.getElementById('colorsListContainer');
    container.innerHTML = '';
    if (p.colors && p.colors.length) {
        p.colors.forEach(c => addColorRow(c.name, c.hex));
    } else {
        addColorRow('Primary Color', '#111111');
    }

    openAdminModal('productModal');
}

async function saveProduct(event) {
    event.preventDefault();
    const editId = document.getElementById('prodEditId').value;
    const name = document.getElementById('prodName').value.trim();
    const category = document.getElementById('prodCategory').value;
    const sub_category = document.getElementById('prodSubCategory').value;
    const season = document.getElementById('prodSeason').value;
    const discount_badge = document.getElementById('prodBadge').value.trim();
    const original_price = Number(document.getElementById('prodOriginalPrice').value);
    const discount_price = Number(document.getElementById('prodDiscountPrice').value);
    const primaryImg = document.getElementById('prodImageUrl').value.trim();
    const fabric = document.getElementById('prodFabric').value.trim();
    const fit = document.getElementById('prodFit').value.trim();
    const care = document.getElementById('prodCare').value.trim();
    const description = document.getElementById('prodDesc').value.trim();

    // Collect sizes
    const sizes = Array.from(document.querySelectorAll('input[name="prodSizes"]:checked')).map(cb => cb.value);
    if (!sizes.length) {
        alert('Please select at least one available size (S, M, L, etc.)');
        return;
    }

    // Collect colors
    const colorRows = document.querySelectorAll('.color-row-item');
    const colors = Array.from(colorRows).map(row => ({
        name: row.querySelector('.color-name-input').value.trim(),
        hex: row.querySelector('.color-hex-input').value,
        image: primaryImg
    })).filter(c => c.name !== '');

    const payload = {
        name,
        category,
        sub_category,
        season,
        discount_badge,
        original_price,
        discount_price,
        images: [primaryImg],
        colors,
        sizes,
        fabric,
        fit,
        care,
        description,
        is_active: 1
    };

    try {
        const url = editId ? `/api/admin/products/${editId}` : '/api/admin/products';
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            closeAdminModal('productModal');
            loadProducts();
            loadStats();
        } else {
            alert('Error saving garment: ' + (data.error || 'Server error'));
        }
    } catch (e) {
        alert('Could not connect to server to save product');
    }
}

async function confirmDeleteProduct(id) {
    if (!confirm(`Are you sure you want to permanently delete garment "${id}"?`)) return;

    try {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.success) {
            loadProducts();
            loadStats();
        } else {
            alert('Failed to delete: ' + data.error);
        }
    } catch (e) {
        alert('Error communicating with server');
    }
}

// Image File Upload Helper
function handleImageFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Data = e.target.result;
        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ base64Data, filename: file.name })
            });
            const data = await res.json();
            if (data.success && data.url) {
                document.getElementById('prodImageUrl').value = window.location.origin + data.url;
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (err) {
            alert('Error uploading image file');
        }
    };
    reader.readAsDataURL(file);
}

// --------------------------------------------------------------------------
// Offers Management
// --------------------------------------------------------------------------
async function loadOffers() {
    try {
        const res = await fetch('/api/admin/offers', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.success) {
            currentOffers = data.offers;
            renderOffersTable(currentOffers);
        }
    } catch (e) {
        console.error('Error loading offers:', e);
    }
}

function renderOffersTable(offers) {
    const tbody = document.getElementById('adminOffersTableBody');
    if (!tbody) return;

    if (!offers.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No offers registered.</td></tr>`;
        return;
    }

    tbody.innerHTML = offers.map(o => `
        <tr>
            <td><code style="color: var(--gold-light); font-weight: 700; font-size: 0.95rem;">${o.code}</code></td>
            <td>
                <strong>${o.title}</strong><br>
                <small style="color: var(--text-muted);">${o.description || '-'}</small>
            </td>
            <td><span class="status-pill ${o.type}">${o.type.replace(/_/g, ' ')}</span></td>
            <td><strong>${o.discount_percent > 0 ? o.discount_percent + '%' : 'Free'}</strong></td>
            <td><span style="text-transform: capitalize;">${o.scope}</span></td>
            <td><small>${o.start_date} to ${o.expiry_date}</small></td>
            <td>
                <label class="switch">
                    <input type="checkbox" ${o.is_active ? 'checked' : ''} onchange="toggleOffer(${o.id}, this.checked)">
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                <button class="btn-outline btn-sm btn-danger" onclick="confirmDeleteOffer(${o.id})" title="Delete Offer">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function setDefaultOfferDates() {
    const startInput = document.getElementById('offerStartDate');
    const expiryInput = document.getElementById('offerExpiryDate');
    if (!startInput || !expiryInput) return;

    const today = new Date().toISOString().split('T')[0];
    const endOfYear = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];

    startInput.value = today;
    expiryInput.value = endOfYear;
}

function adjustOfferTypeFields() {
    const type = document.getElementById('offerType').value;
    const discountSelect = document.getElementById('offerDiscountPercent');

    if (type === 'buy2_10') discountSelect.value = '10';
    else if (type === 'buy3_20') discountSelect.value = '20';
    else if (type === 'bogo') discountSelect.value = '50';
    else if (type === 'free_shipping') discountSelect.value = '0';
}

function openAddOfferModal() {
    document.getElementById('offerForm').reset();
    document.getElementById('offerEditId').value = '';
    setDefaultOfferDates();
    openAdminModal('offerModal');
}

async function saveOffer(event) {
    event.preventDefault();
    const code = document.getElementById('offerCode').value.trim().toUpperCase();
    const type = document.getElementById('offerType').value;
    const title = document.getElementById('offerTitle').value.trim();
    const discount_percent = Number(document.getElementById('offerDiscountPercent').value);
    const min_order_amount = Number(document.getElementById('offerMinOrder').value || 0);
    const scope = document.getElementById('offerScope').value;
    const start_date = document.getElementById('offerStartDate').value;
    const expiry_date = document.getElementById('offerExpiryDate').value;
    const description = document.getElementById('offerDesc').value.trim();

    const payload = {
        code,
        title,
        type,
        discount_percent,
        min_order_amount,
        scope,
        start_date,
        expiry_date,
        description,
        is_active: 1
    };

    try {
        const res = await fetch('/api/admin/offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            closeAdminModal('offerModal');
            loadOffers();
        } else {
            alert('Failed to save offer: ' + data.error);
        }
    } catch (e) {
        alert('Server communication error');
    }
}

async function toggleOffer(id, isActive) {
    try {
        await fetch(`/api/admin/offers/${id}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ is_active: isActive })
        });
        loadOffers();
    } catch (e) {
        console.error('Error toggling offer:', e);
    }
}

async function confirmDeleteOffer(id) {
    if (!confirm('Are you sure you want to delete this promotional offer?')) return;
    try {
        await fetch(`/api/admin/offers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        loadOffers();
    } catch (e) {
        console.error('Error deleting offer:', e);
    }
}

// --------------------------------------------------------------------------
// Orders Management
// --------------------------------------------------------------------------
async function loadOrders() {
    try {
        const res = await fetch('/api/admin/orders', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.success) {
            currentOrders = data.orders;
            filterAdminOrders();
        }
    } catch (e) {
        console.error('Error loading orders:', e);
    }
}

function filterAdminOrders() {
    const status = document.getElementById('adminOrderStatusFilter')?.value || 'all';
    let filtered = [...currentOrders];
    if (status !== 'all') {
        filtered = filtered.filter(o => o.order_status === status);
    }
    renderOrdersTable(filtered);
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('adminOrdersTableBody');
    if (!tbody) return;

    if (!orders.length) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2rem;">No orders found.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => {
        const itemsSummary = (o.items || []).map(i => `${i.name} (${i.selectedSize || 'Standard'}) x${i.quantity}`).join('<br>');
        return `
            <tr>
                <td><strong style="color: var(--gold-light);">${o.id}</strong><br><small style="color: var(--text-dim);">${o.created_at}</small></td>
                <td>
                    <strong>${o.customer_name}</strong><br>
                    <small style="color: var(--text-muted);">${o.customer_phone}</small>
                </td>
                <td>
                    <span style="color: #fff;">${o.city}</span><br>
                    <small style="color: var(--text-muted);">${o.address_line}</small>
                </td>
                <td><small style="color: var(--text-muted);">${itemsSummary}</small></td>
                <td><strong style="color: var(--gold-bright);">Rs. ${o.grand_total.toLocaleString()}</strong></td>
                <td><span style="font-size: 0.8rem; color: #2ecc71;">${o.payment_method}</span></td>
                <td><span class="status-pill ${o.order_status}">${o.order_status}</span></td>
                <td><small>${o.courier_name || 'TCS Express'}</small></td>
                <td>
                    <button class="btn-gold btn-sm" onclick="viewOrderDetails('${o.id}')">Manage</button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewOrderDetails(orderId) {
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return;

    selectedViewingOrderId = orderId;
    document.getElementById('viewOrderId').textContent = order.id;
    document.getElementById('viewOrderDate').textContent = `Placed on ${order.created_at} • Courier: ${order.courier_name}`;
    document.getElementById('viewOrderCustomer').textContent = order.customer_name;
    document.getElementById('viewOrderPhone').textContent = `Phone: ${order.customer_phone}`;
    document.getElementById('viewOrderEmail').textContent = `Email: ${order.customer_email}`;
    document.getElementById('viewOrderAddress').textContent = order.address_line;
    document.getElementById('viewOrderCity').textContent = `City: ${order.city}`;
    document.getElementById('viewOrderPayment').textContent = `${order.payment_method} (${order.payment_status})`;
    document.getElementById('viewOrderTotal').textContent = `Rs. ${order.grand_total.toLocaleString()}`;

    // Items list
    const itemsContainer = document.getElementById('viewOrderItemsList');
    itemsContainer.innerHTML = (order.items || []).map(i => `
        <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.85rem;">
            <span>${i.name} (Color: ${i.selectedColor || '-'}, Size: ${i.selectedSize || '-'}) x${i.quantity}</span>
            <strong style="color: var(--gold-light);">Rs. ${(i.price * i.quantity).toLocaleString()}</strong>
        </div>
    `).join('');

    // Pre-select current status
    document.getElementById('updateOrderStatusSelect').value = order.order_status;
    document.getElementById('updateOrderNote').value = '';

    openAdminModal('orderModal');
}

async function submitOrderStatusUpdate() {
    if (!selectedViewingOrderId) return;
    const newStatus = document.getElementById('updateOrderStatusSelect').value;
    const note = document.getElementById('updateOrderNote').value.trim();

    try {
        const res = await fetch(`/api/admin/orders/${selectedViewingOrderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status: newStatus, note })
        });
        const data = await res.json();
        if (data.success) {
            closeAdminModal('orderModal');
            loadOrders();
            loadStats();
        } else {
            alert('Failed to update status: ' + data.error);
        }
    } catch (e) {
        alert('Server communication error');
    }
}

// --------------------------------------------------------------------------
// Modal Helpers
// --------------------------------------------------------------------------
function openAdminModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
}

function closeAdminModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
}

// --------------------------------------------------------------------------
// Registered Customers Management
// --------------------------------------------------------------------------
async function loadCustomers() {
    try {
        const res = await fetch('/api/admin/customers', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.success) {
            currentCustomers = data.customers || [];
            filterAdminCustomers();
        }
    } catch (e) {
        console.error('Error loading customers:', e);
    }
}

function filterAdminCustomers() {
    const query = (document.getElementById('adminCustomerSearch')?.value || '').toLowerCase().trim();
    let filtered = [...currentCustomers];
    if (query) {
        filtered = filtered.filter(c => 
            (c.name || '').toLowerCase().includes(query) ||
            (c.email || '').toLowerCase().includes(query) ||
            (c.city || '').toLowerCase().includes(query) ||
            (c.phone || '').includes(query)
        );
    }
    renderCustomersTable(filtered);
}

function renderCustomersTable(customers) {
    const tbody = document.getElementById('adminCustomersTableBody');
    if (!tbody) return;

    if (!customers.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No registered customers found. Real client registrations will appear here automatically.</td></tr>`;
        return;
    }

    tbody.innerHTML = customers.map(c => `
        <tr>
            <td><strong style="color: var(--gold-light);">#${c.id}</strong></td>
            <td><strong>${escapeHtml(c.name)}</strong></td>
            <td><a href="mailto:${escapeHtml(c.email)}" style="color: var(--gold-bright); text-decoration: none;">${escapeHtml(c.email)}</a></td>
            <td>${c.phone ? escapeHtml(c.phone) : '<span style="color: var(--text-dim);">-</span>'}</td>
            <td>${c.city ? escapeHtml(c.city) : '<span style="color: var(--text-dim);">-</span>'}</td>
            <td><span style="background: rgba(197, 160, 89, 0.2); color: #fff; padding: 3px 9px; border-radius: 12px; font-weight: 700; font-size: 0.8rem;">${c.orders_count || 0}</span></td>
            <td><strong style="color: var(--gold-bright);">Rs. ${(c.total_spent || 0).toLocaleString()}</strong></td>
            <td><small style="color: var(--text-muted);">${c.created_at ? c.created_at.split(' ')[0] : '-'}</small></td>
        </tr>
    `).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

