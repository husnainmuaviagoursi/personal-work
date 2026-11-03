// ==========================================================================
// HUSNAIN FASHION - Customer Account Dashboard Controller
// ==========================================================================

let userToken = localStorage.getItem('hf_token') || null;
let currentUser = null;
let userOrders = [];
let userAddresses = [];

document.addEventListener('DOMContentLoaded', () => {
    checkCustomerAuth();
});

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
// Auth State Check
// --------------------------------------------------------------------------
async function checkCustomerAuth() {
    if (!userToken) {
        showCustomerAuthGate();
        return;
    }

    try {
        const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await res.json();
        if (data.success && data.user) {
            currentUser = data.user;
            showCustomerDashboard();
            loadCustomerData();
        } else {
            showCustomerAuthGate();
        }
    } catch (e) {
        showCustomerAuthGate();
    }
}

function showCustomerAuthGate() {
    document.getElementById('customerAuthGate').style.display = 'block';
    document.getElementById('customerDashboardMain').style.display = 'none';
    document.getElementById('customerLogoutBtn').style.display = 'none';
}

function showCustomerDashboard() {
    document.getElementById('customerAuthGate').style.display = 'none';
    document.getElementById('customerDashboardMain').style.display = 'grid';
    document.getElementById('customerLogoutBtn').style.display = 'inline-flex';

    // Populate Sidebar info
    const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'H';
    document.getElementById('dashAvatar').textContent = initial;
    document.getElementById('dashCustomerName').textContent = currentUser.name || 'Valued Customer';
    document.getElementById('dashCustomerEmail').textContent = currentUser.email;

    // Populate profile form
    document.getElementById('profName').value = currentUser.name || '';
    document.getElementById('profEmail').value = currentUser.email || '';
    document.getElementById('profPhone').value = currentUser.phone || '';
    document.getElementById('profCity').value = currentUser.city || 'Lahore';
}

function toggleCustomerAuthTab(tab) {
    const loginForm = document.getElementById('portalLoginForm');
    const signupForm = document.getElementById('portalSignupForm');
    const btnLogin = document.getElementById('tabBtnLogin');
    const btnSignup = document.getElementById('tabBtnSignup');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        btnLogin.className = 'btn btn-sm btn-gold';
        btnSignup.className = 'btn btn-sm btn-dark';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        btnLogin.className = 'btn btn-sm btn-dark';
        btnSignup.className = 'btn btn-sm btn-gold';
    }
}

async function handleCustomerLogin(event) {
    event.preventDefault();
    const email = document.getElementById('custEmail').value.trim();
    const password = document.getElementById('custPassword').value.trim();

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            userToken = data.token;
            currentUser = data.user;
            localStorage.setItem('hf_token', userToken);
            localStorage.setItem('hf_user', JSON.stringify(currentUser));
            showCustomerDashboard();
            loadCustomerData();
        } else {
            alert(data.error || 'Login failed. Please check your email and password.');
        }
    } catch (e) {
        alert('Could not connect to login server.');
    }
}

async function handleCustomerSignup(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const city = document.getElementById('regCity').value.trim() || 'Lahore';
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, city, password, confirmPassword })
        });
        const data = await res.json();

        if (data.success) {
            userToken = data.token;
            currentUser = data.user;
            localStorage.setItem('hf_token', userToken);
            localStorage.setItem('hf_user', JSON.stringify(currentUser));
            alert('Welcome to Husnain Fashion, ' + name + '!');
            showCustomerDashboard();
            loadCustomerData();
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (e) {
        alert('Could not communicate with signup server.');
    }
}

function customerLogout() {
    localStorage.removeItem('hf_token');
    localStorage.removeItem('hf_user');
    userToken = null;
    currentUser = null;
    showCustomerAuthGate();
}

// --------------------------------------------------------------------------
// Navigation Tabs
// --------------------------------------------------------------------------
function switchCustomerTab(tabId, el) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.dash-nav-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    if (el) el.classList.add('active');

    if (tabId === 'tabOrders') loadCustomerOrders();
    else if (tabId === 'tabAddresses') loadCustomerAddresses();
    else if (tabId === 'tabWishlist') renderCustomerWishlist();
}

// --------------------------------------------------------------------------
// Data Loading
// --------------------------------------------------------------------------
async function loadCustomerData() {
    await Promise.all([
        loadCustomerOrders(),
        loadCustomerAddresses(),
        renderCustomerWishlist()
    ]);
}

async function loadCustomerOrders() {
    const container = document.getElementById('customerOrdersContainer');
    if (!container) return;

    try {
        const res = await fetch('/api/user/orders', {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await res.json();

        if (data.success) {
            userOrders = data.orders || [];
            renderCustomerOrders(userOrders);
        }
    } catch (e) {
        container.innerHTML = '<p style="color: var(--color-danger);">Error loading orders.</p>';
    }
}

function renderCustomerOrders(orders) {
    const container = document.getElementById('customerOrdersContainer');
    if (!container) return;

    if (!orders.length) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem;">
                <i class="fa-solid fa-box-open" style="font-size: 2.5rem; color: var(--color-gold); opacity: 0.6; margin-bottom: 1rem;"></i>
                <h4 style="color: #fff; font-family: var(--font-heading); margin-bottom: 0.5rem;">No Orders Yet</h4>
                <p style="color: var(--color-text-muted); font-size: 0.88rem; margin-bottom: 1.5rem;">You haven't placed any orders yet. Discover our latest collections.</p>
                <a href="index.html#shop-section" class="btn btn-gold btn-sm">Explore Garments</a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(o => {
        const itemsHtml = (o.items || []).map(item => `
            <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.85rem; border-bottom: 1px dashed rgba(255,255,255,0.06);">
                <span>${item.name} (Color: ${item.selectedColor || '-'}, Size: ${item.selectedSize || '-'}) x${item.quantity}</span>
                <strong style="color: var(--color-gold-light);">Rs. ${(item.price * item.quantity).toLocaleString()}</strong>
            </div>
        `).join('');

        return `
            <div class="order-card-item">
                <div class="flex-between" style="margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                        <strong style="color: var(--color-gold-light); font-size: 1.05rem;">Consignment ID: ${o.id}</strong>
                        <div style="font-size: 0.75rem; color: var(--color-text-dim); margin-top: 2px;">Placed on ${o.created_at}</div>
                    </div>
                    <div>
                        <span class="status-pill ${o.order_status}">${o.order_status}</span>
                    </div>
                </div>

                <div style="margin-bottom: 1rem;">
                    ${itemsHtml}
                </div>

                <div class="flex-between" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.85rem; flex-wrap: wrap; gap: 0.75rem; font-size: 0.88rem;">
                    <div>
                        <span style="color: var(--color-text-muted);">Destination:</span> <strong>${o.city}</strong> | 
                        <span style="color: var(--color-text-muted);">Payment:</span> <span style="color: #2ecc71;">${o.payment_method}</span>
                    </div>
                    <div>
                        <span style="color: var(--color-text-muted);">Grand Total:</span>
                        <strong style="color: var(--color-gold-bright); font-size: 1.15rem; margin-left: 6px;">Rs. ${o.grand_total.toLocaleString()}</strong>
                    </div>
                </div>

                <div style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
                    <a href="index.html#tracking-section" class="btn btn-outline btn-sm" onclick="localStorage.setItem('hf_track_query', '${o.id}')">
                        <i class="fa-solid fa-truck-fast"></i> Track Shipment
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// --------------------------------------------------------------------------
// Addresses Management
// --------------------------------------------------------------------------
async function loadCustomerAddresses() {
    try {
        const res = await fetch('/api/user/addresses', {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await res.json();
        if (data.success) {
            userAddresses = data.addresses || [];
            renderCustomerAddresses(userAddresses);
        }
    } catch (e) {
        console.error('Error loading addresses:', e);
    }
}

function renderCustomerAddresses(addresses) {
    const grid = document.getElementById('customerAddressesGrid');
    if (!grid) return;

    if (!addresses.length) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 2rem;">No saved addresses. Click "Add Address" above.</p>`;
        return;
    }

    grid.innerHTML = addresses.map(a => `
        <div class="address-card ${a.is_default ? 'is-default' : ''}">
            <div class="flex-between" style="margin-bottom: 0.5rem;">
                <strong style="color: var(--color-gold-light); font-size: 0.95rem;">${a.label}</strong>
                ${a.is_default ? '<span style="font-size: 0.7rem; background: rgba(197,160,89,0.2); color: var(--color-gold); padding: 2px 6px; border-radius: 4px;">DEFAULT</span>' : ''}
            </div>
            <p style="color: #fff; font-weight: 600; font-size: 0.88rem; margin-bottom: 2px;">${a.recipient_name}</p>
            <p style="color: var(--color-text-muted); font-size: 0.82rem; margin-bottom: 4px;">Phone: ${a.phone}</p>
            <p style="color: var(--color-text-dim); font-size: 0.82rem; line-height: 1.4;">${a.address_line}, ${a.city} ${a.postal_code || ''}</p>
            <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                <button class="btn btn-outline btn-sm btn-danger" onclick="deleteAddress(${a.id})" title="Delete">
                    <i class="fa-solid fa-trash-can"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

function toggleNewAddressForm() {
    const form = document.getElementById('newAddressFormContainer');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function handleSaveAddress(event) {
    event.preventDefault();
    const label = document.getElementById('addrLabel').value.trim();
    const recipient_name = document.getElementById('addrRecipient').value.trim();
    const phone = document.getElementById('addrPhone').value.trim();
    const city = document.getElementById('addrCity').value.trim();
    const address_line = document.getElementById('addrLine').value.trim();
    const postal_code = document.getElementById('addrPostal').value.trim();
    const is_default = document.getElementById('addrDefault').checked;

    try {
        const res = await fetch('/api/user/addresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ label, recipient_name, phone, city, address_line, postal_code, is_default })
        });
        const data = await res.json();
        if (data.success) {
            toggleNewAddressForm();
            loadCustomerAddresses();
        } else {
            alert(data.error || 'Failed to save address');
        }
    } catch (e) {
        alert('Server connection error');
    }
}

async function deleteAddress(addrId) {
    if (!confirm('Are you sure you want to remove this address?')) return;
    try {
        const res = await fetch(`/api/user/addresses/${addrId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await res.json();
        if (data.success) {
            loadCustomerAddresses();
        }
    } catch (e) {
        alert('Error removing address');
    }
}

// --------------------------------------------------------------------------
// Profile Update
// --------------------------------------------------------------------------
async function handleProfileUpdate(event) {
    event.preventDefault();
    const name = document.getElementById('profName').value.trim();
    const phone = document.getElementById('profPhone').value.trim();
    const city = document.getElementById('profCity').value.trim();

    try {
        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ name, phone, city })
        });
        const data = await res.json();
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('hf_user', JSON.stringify(currentUser));
            document.getElementById('dashCustomerName').textContent = currentUser.name;
            alert('Profile updated successfully!');
        } else {
            alert(data.error || 'Failed to update profile');
        }
    } catch (e) {
        alert('Server communication error');
    }
}

// --------------------------------------------------------------------------
// Change Password
// --------------------------------------------------------------------------
async function handleChangePassword(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('currPass').value.trim();
    const newPassword = document.getElementById('newPass').value.trim();
    const confirmPassword = document.getElementById('confNewPass').value.trim();

    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }

    try {
        const res = await fetch('/api/user/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        });
        const data = await res.json();
        if (data.success) {
            alert('Password updated successfully!');
            document.getElementById('currPass').value = '';
            document.getElementById('newPass').value = '';
            document.getElementById('confNewPass').value = '';
        } else {
            alert(data.error || 'Failed to change password');
        }
    } catch (e) {
        alert('Server communication error');
    }
}

// --------------------------------------------------------------------------
// Wishlist
// --------------------------------------------------------------------------
function renderCustomerWishlist() {
    const container = document.getElementById('customerWishlistContainer');
    if (!container) return;

    const wishlistIds = JSON.parse(localStorage.getItem('hf_wishlist')) || [];
    if (!wishlistIds.length || typeof PRODUCTS_DATA === 'undefined') {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 3rem 0;">Your wishlist is empty. Browse the collection to save favorites.</p>`;
        return;
    }

    const items = PRODUCTS_DATA.filter(p => wishlistIds.includes(p.id));
    container.innerHTML = items.map(p => `
        <div style="background: #0f0f13; border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-sm); overflow: hidden;">
            <img src="${p.images[0]}" alt="${p.name}" style="width: 100%; aspect-ratio: 3/4; object-fit: cover;">
            <div style="padding: 1rem;">
                <h5 style="color: #fff; font-size: 0.9rem; margin-bottom: 0.35rem;">${p.name}</h5>
                <strong style="color: var(--color-gold-bright); font-size: 0.95rem;">Rs. ${p.discount_price.toLocaleString()}</strong>
                <div style="margin-top: 0.85rem;">
                    <a href="index.html#shop-section" class="btn btn-gold btn-sm btn-block">Shop Design</a>
                </div>
            </div>
        </div>
    `).join('');
}

// --------------------------------------------------------------------------
// Forgot Password Flow
// --------------------------------------------------------------------------
let resetTargetEmail = '';

function openForgotPasswordFlow() {
    document.getElementById('forgotStep1Form').style.display = 'block';
    document.getElementById('forgotStep2Form').style.display = 'none';
    document.getElementById('resetReqEmail').value = document.getElementById('custEmail')?.value || '';
    openModal('forgotPassModal');
}

async function handleSendResetCode(event) {
    event.preventDefault();
    resetTargetEmail = document.getElementById('resetReqEmail').value.trim();

    try {
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetTargetEmail })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('forgotStep1Form').style.display = 'none';
            document.getElementById('forgotStep2Form').style.display = 'block';
            document.getElementById('demoCodeBanner').innerHTML = `
                <i class="fa-solid fa-key"></i> Verification code generated: <strong>${data.demoResetCode}</strong> (Valid for 15 mins)
            `;
            document.getElementById('resetInputCode').value = data.demoResetCode;
        } else {
            alert(data.error || 'Email not found');
        }
    } catch (e) {
        alert('Server communication error');
    }
}

async function handleConfirmResetPassword(event) {
    event.preventDefault();
    const code = document.getElementById('resetInputCode').value.trim();
    const newPassword = document.getElementById('resetNewPass').value.trim();
    const confirmPassword = document.getElementById('resetConfPass').value.trim();

    try {
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetTargetEmail, code, newPassword, confirmPassword })
        });
        const data = await res.json();
        if (data.success) {
            alert('Password reset successfully! You can now log in.');
            closeModal('forgotPassModal');
        } else {
            alert(data.error || 'Failed to reset password');
        }
    } catch (e) {
        alert('Server communication error');
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
}

