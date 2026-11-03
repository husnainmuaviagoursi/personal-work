// ==========================================================================
// HUSNAIN FASHION - Secure Backend Server & REST API
// Built with Node.js built-in HTTP, SQLite, & Cryptography
// ==========================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const DB = require('./db.js');

const PORT = 3000;
const JWT_SECRET = 'HusnainFashion_Secret_Key_2026_PK_HauteCouture';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// MIME Types
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

// Simple secure Token generation & verification (HMAC-SHA256)
function generateToken(payload) {
    const data = Buffer.from(JSON.stringify({
        ...payload,
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
    return `${data}.${signature}`;
}

function verifyToken(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [data, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
    if (signature !== expectedSignature) return null;

    try {
        const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
        if (payload.exp && Date.now() > payload.exp) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

// Request Body Parser
function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 15 * 1024 * 1024) { // 15MB limit for images
                req.destroy();
                reject(new Error('Payload too large'));
            }
        });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({ raw: body });
            }
        });
        req.on('error', reject);
    });
}

// JSON Response Helpers
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
    sendJSON(res, statusCode, { success: false, error: message });
}

// Auth Middleware Helper
function authenticateRequest(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
        return verifyToken(parts[1]);
    }
    return null;
}

// ==========================================================================
// HTTP Request Router
// ==========================================================================
const server = http.createServer(async (req, res) => {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        });
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // ----------------------------------------------------------------------
    // API ROUTES
    // ----------------------------------------------------------------------
    if (pathname.startsWith('/api/')) {
        try {
            // --- AUTH APIS ---
            // 1. Customer Signup
            if (pathname === '/api/auth/signup' && method === 'POST') {
                const body = await parseRequestBody(req);
                const { name, email, phone, city, password, confirmPassword } = body;

                if (!name || !email || !password) {
                    return sendError(res, 400, 'Name, email, and password are required');
                }
                if (password.length < 6) {
                    return sendError(res, 400, 'Password must be at least 6 characters long');
                }
                if (confirmPassword && password !== confirmPassword) {
                    return sendError(res, 400, 'Passwords do not match');
                }

                const existingUser = DB.getUserByEmail(email.toLowerCase().trim());
                if (existingUser) {
                    return sendError(res, 400, 'An account with this email already exists');
                }

                const user = DB.createUser(name.trim(), email.toLowerCase().trim(), phone || '', city || 'Lahore', password, 'customer');
                const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });

                return sendJSON(res, 201, {
                    success: true,
                    message: 'Account created successfully',
                    user,
                    token
                });
            }

            // 2. Customer / Admin Login
            if (pathname === '/api/auth/login' && method === 'POST') {
                const body = await parseRequestBody(req);
                const { email, password } = body;

                if (!email || !password) {
                    return sendError(res, 400, 'Email and password are required');
                }

                const user = DB.getUserByEmail(email.toLowerCase().trim());
                if (!user) {
                    return sendError(res, 401, 'Invalid email or password');
                }

                const isValid = DB.verifyPassword(password, user.salt, user.password_hash);
                if (!isValid) {
                    return sendError(res, 401, 'Invalid email or password');
                }

                const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });
                const sanitizedUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    city: user.city,
                    role: user.role
                };

                return sendJSON(res, 200, {
                    success: true,
                    message: 'Login successful',
                    user: sanitizedUser,
                    token
                });
            }

            // 3. Current User Me
            if (pathname === '/api/auth/me' && method === 'GET') {
                const decoded = authenticateRequest(req);
                if (!decoded) return sendError(res, 401, 'Unauthorized');

                const user = DB.getUserById(decoded.id);
                if (!user) return sendError(res, 404, 'User not found');

                return sendJSON(res, 200, { success: true, user });
            }

            // 4. Forgot Password (Generates 6-Digit Verification Code)
            if (pathname === '/api/auth/forgot-password' && method === 'POST') {
                const body = await parseRequestBody(req);
                const { email } = body;

                if (!email) return sendError(res, 400, 'Email is required');
                const user = DB.getUserByEmail(email.toLowerCase().trim());
                if (!user) {
                    return sendError(res, 404, 'No account found with this email address');
                }

                const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
                const expiry = Date.now() + (15 * 60 * 1000); // 15 mins
                DB.setResetCode(user.email, resetCode, expiry);

                return sendJSON(res, 200, {
                    success: true,
                    message: 'Verification reset code generated',
                    demoResetCode: resetCode // returned for instant browser demo convenience
                });
            }

            // 5. Reset Password with Code
            if (pathname === '/api/auth/reset-password' && method === 'POST') {
                const body = await parseRequestBody(req);
                const { email, code, newPassword, confirmPassword } = body;

                if (!email || !code || !newPassword) {
                    return sendError(res, 400, 'Email, reset code, and new password are required');
                }
                if (newPassword.length < 6) {
                    return sendError(res, 400, 'Password must be at least 6 characters long');
                }
                if (confirmPassword && newPassword !== confirmPassword) {
                    return sendError(res, 400, 'Passwords do not match');
                }

                const user = DB.getUserByEmail(email.toLowerCase().trim());
                if (!user || user.reset_code !== code.trim()) {
                    return sendError(res, 400, 'Invalid verification code');
                }
                if (Date.now() > user.reset_code_expiry) {
                    return sendError(res, 400, 'Verification code has expired. Please request a new code.');
                }

                DB.updateUserPassword(user.id, newPassword);
                DB.setResetCode(user.email, null, null); // clear code

                return sendJSON(res, 200, {
                    success: true,
                    message: 'Password reset successfully. You can now log in.'
                });
            }

            // 6. Change Password (Logged-In Customer)
            if (pathname === '/api/user/change-password' && method === 'PUT') {
                const decoded = authenticateRequest(req);
                if (!decoded) return sendError(res, 401, 'Unauthorized');

                const body = await parseRequestBody(req);
                const { currentPassword, newPassword, confirmPassword } = body;

                if (!currentPassword || !newPassword) {
                    return sendError(res, 400, 'Current and new password are required');
                }
                if (newPassword.length < 6) {
                    return sendError(res, 400, 'New password must be at least 6 characters');
                }
                if (confirmPassword && newPassword !== confirmPassword) {
                    return sendError(res, 400, 'New passwords do not match');
                }

                const user = DB.getUserByEmail(decoded.email);
                const isValid = DB.verifyPassword(currentPassword, user.salt, user.password_hash);
                if (!isValid) {
                    return sendError(res, 400, 'Incorrect current password');
                }

                DB.updateUserPassword(user.id, newPassword);
                return sendJSON(res, 200, { success: true, message: 'Password updated successfully' });
            }

            // 7. Update Customer Profile
            if (pathname === '/api/user/profile' && method === 'PUT') {
                const decoded = authenticateRequest(req);
                if (!decoded) return sendError(res, 401, 'Unauthorized');

                const body = await parseRequestBody(req);
                const { name, phone, city } = body;

                const updated = DB.updateUserProfile(decoded.id, name || decoded.name, phone || '', city || 'Lahore');
                return sendJSON(res, 200, { success: true, user: updated });
            }

            // 8. User Addresses
            if (pathname === '/api/user/addresses' && method === 'GET') {
                const decoded = authenticateRequest(req);
                if (!decoded) return sendError(res, 401, 'Unauthorized');

                const addresses = DB.getUserAddresses(decoded.id);
                return sendJSON(res, 200, { success: true, addresses });
            }

            if (pathname === '/api/user/addresses' && method === 'POST') {
                const decoded = authenticateRequest(req);
                if (!decoded) return sendError(res, 401, 'Unauthorized');

                const body = await parseRequestBody(req);
                const { label, recipient_name, phone, address_line, city, postal_code, is_default } = body;

                if (!recipient_name || !phone || !address_line || !city) {
                    return sendError(res, 400, 'Recipient name, phone, address, and city are required');
                }

                const id = DB.addAddress(decoded.id, label || 'Home', recipient_name, phone, address_line, city, postal_code || '', !!is_default);
                const addresses = DB.getUserAddresses(decoded.id);
                return sendJSON(res, 201, { success: true, addressId: id, addresses });
            }

            if (pathname.startsWith('/api/user/addresses/') && method === 'DELETE') {
                const decoded = authenticateRequest(req);
                if (!decoded) return sendError(res, 401, 'Unauthorized');

                const addrId = Number(pathname.split('/').pop());
                DB.deleteAddress(addrId, decoded.id);
                const addresses = DB.getUserAddresses(decoded.id);
                return sendJSON(res, 200, { success: true, addresses });
            }

            // 9. User Order History
            if (pathname === '/api/user/orders' && method === 'GET') {
                const decoded = authenticateRequest(req);
                if (!decoded) return sendError(res, 401, 'Unauthorized');

                const orders = DB.getUserOrders(decoded.id, decoded.email);
                return sendJSON(res, 200, { success: true, orders });
            }

            // --- PRODUCT APIS ---
            // 10. Get Public Products
            if (pathname === '/api/products' && method === 'GET') {
                const products = DB.getAllProducts(false);
                return sendJSON(res, 200, { success: true, products });
            }

            if (pathname.startsWith('/api/products/') && method === 'GET') {
                const id = pathname.replace('/api/products/', '');
                const product = DB.getProductById(id);
                if (!product) return sendError(res, 404, 'Product not found');
                return sendJSON(res, 200, { success: true, product });
            }

            // --- OFFERS & COUPONS APIS ---
            // 11. Get Public Active Offers
            if (pathname === '/api/offers' && method === 'GET') {
                const offers = DB.getAllOffers(false);
                return sendJSON(res, 200, { success: true, offers });
            }

            // 12. Validate Coupon Code
            if (pathname === '/api/offers/validate' && method === 'POST') {
                const body = await parseRequestBody(req);
                const { code, subtotal, cartItems } = body;

                if (!code) return sendError(res, 400, 'Coupon code is required');
                const offer = DB.getOfferByCode(code.trim());

                if (!offer) {
                    return sendError(res, 404, 'Invalid coupon code or expired');
                }

                // Check dates
                const today = new Date().toISOString().split('T')[0];
                if (offer.start_date && today < offer.start_date) {
                    return sendError(res, 400, `Offer starts on ${offer.start_date}`);
                }
                if (offer.expiry_date && today > offer.expiry_date) {
                    return sendError(res, 400, `This offer expired on ${offer.expiry_date}`);
                }

                // Check min order amount
                if (offer.min_order_amount > 0 && subtotal < offer.min_order_amount) {
                    return sendError(res, 400, `Minimum order amount of Rs. ${offer.min_order_amount.toLocaleString()} required for this coupon`);
                }

                return sendJSON(res, 200, {
                    success: true,
                    offer
                });
            }

            // --- ORDERS APIS ---
            // 13. Create New Order (Storefront Checkout)
            if (pathname === '/api/orders' && method === 'POST') {
                const body = await parseRequestBody(req);
                const {
                    customer_name, customer_email, customer_phone, address_line, city,
                    postal_code, items, subtotal, discount_amount, delivery_fee, grand_total,
                    coupon_code, payment_method
                } = body;

                if (!customer_name || !customer_email || !customer_phone || !address_line || !city || !items || !items.length) {
                    return sendError(res, 400, 'Incomplete order details');
                }

                // Check if user is logged in
                const decoded = authenticateRequest(req);
                const userId = decoded ? decoded.id : null;

                // Generate authentic Pakistani Tracking ID
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                const orderId = `HF-PK-${randomNum}`;

                let courier = 'TCS Express Pakistan';
                if (city.toLowerCase().includes('karachi') || city.toLowerCase().includes('hyderabad')) courier = 'Leopards Courier Service';
                else if (city.toLowerCase().includes('islamabad') || city.toLowerCase().includes('rawalpindi')) courier = 'Call Courier Express';

                const newOrder = DB.createOrder({
                    id: orderId,
                    user_id: userId,
                    customer_name,
                    customer_email,
                    customer_phone,
                    address_line,
                    city,
                    postal_code: postal_code || '',
                    items,
                    subtotal: Number(subtotal),
                    discount_amount: Number(discount_amount || 0),
                    delivery_fee: Number(delivery_fee || 0),
                    grand_total: Number(grand_total),
                    coupon_code: coupon_code || '',
                    payment_method: payment_method || 'Cash on Delivery (COD)',
                    payment_status: payment_method === 'Cash on Delivery (COD)' ? 'Pending' : 'Paid',
                    order_status: 'Processing',
                    courier_name: courier
                });

                return sendJSON(res, 201, {
                    success: true,
                    message: 'Order placed successfully',
                    order: newOrder
                });
            }

            // 14. Track Order by ID
            if (pathname.startsWith('/api/orders/') && method === 'GET') {
                const id = pathname.replace('/api/orders/', '').trim().toUpperCase();
                const order = DB.getOrderById(id);
                if (!order) return sendError(res, 404, 'Order not found');
                return sendJSON(res, 200, { success: true, order });
            }

            // --- ADMIN APIS (Protected by role === 'admin') ---
            // 15. Admin Login
            if (pathname === '/api/admin/login' && method === 'POST') {
                const body = await parseRequestBody(req);
                const { email, password } = body;

                if (!email || !password) return sendError(res, 400, 'Admin email and password required');
                const user = DB.getUserByEmail(email.toLowerCase().trim());
                if (!user || user.role !== 'admin') {
                    return sendError(res, 403, 'Access denied. Administrator credentials required.');
                }

                const isValid = DB.verifyPassword(password, user.salt, user.password_hash);
                if (!isValid) return sendError(res, 401, 'Invalid password');

                const token = generateToken({ id: user.id, email: user.email, name: user.name, role: 'admin' });
                return sendJSON(res, 200, {
                    success: true,
                    message: 'Admin authentication granted',
                    token,
                    user: { id: user.id, name: user.name, email: user.email, role: 'admin' }
                });
            }

            // Admin Authorization Guard
            if (pathname.startsWith('/api/admin/')) {
                const decoded = authenticateRequest(req);
                if (!decoded || decoded.role !== 'admin') {
                    return sendError(res, 403, 'Unauthorized. Admin privilege required.');
                }

                // 16. Admin Dashboard Stats
                if (pathname === '/api/admin/stats' && method === 'GET') {
                    const stats = DB.getStats();
                    return sendJSON(res, 200, { success: true, stats });
                }

                // 17. Admin Products CRUD
                if (pathname === '/api/admin/products' && method === 'GET') {
                    const products = DB.getAllProducts(true);
                    return sendJSON(res, 200, { success: true, products });
                }

                if (pathname === '/api/admin/products' && method === 'POST') {
                    const body = await parseRequestBody(req);
                    const { name, category, sub_category, season, original_price, discount_price } = body;

                    if (!name || !category || !sub_category || !original_price || !discount_price) {
                        return sendError(res, 400, 'Missing mandatory product fields');
                    }

                    const newId = body.id || `HF-${category.substring(0,2).toUpperCase()}-${Math.floor(10 + Math.random()*90)}`;
                    const product = DB.createProduct({
                        ...body,
                        id: newId
                    });
                    return sendJSON(res, 201, { success: true, product });
                }

                if (pathname.startsWith('/api/admin/products/') && method === 'PUT') {
                    const id = pathname.replace('/api/admin/products/', '');
                    const body = await parseRequestBody(req);
                    const updated = DB.updateProduct(id, body);
                    return sendJSON(res, 200, { success: true, product: updated });
                }

                if (pathname.startsWith('/api/admin/products/') && method === 'DELETE') {
                    const id = pathname.replace('/api/admin/products/', '');
                    DB.deleteProduct(id);
                    return sendJSON(res, 200, { success: true, message: 'Product deleted' });
                }

                // 18. Admin Offers CRUD
                if (pathname === '/api/admin/offers' && method === 'GET') {
                    const offers = DB.getAllOffers(true);
                    return sendJSON(res, 200, { success: true, offers });
                }

                if (pathname === '/api/admin/offers' && method === 'POST') {
                    const body = await parseRequestBody(req);
                    const { code, title, type, start_date, expiry_date } = body;
                    if (!code || !title || !type || !start_date || !expiry_date) {
                        return sendError(res, 400, 'Code, title, type, start date, and expiry date are required');
                    }
                    const offer = DB.createOffer(body);
                    return sendJSON(res, 201, { success: true, offer });
                }

                if (pathname.startsWith('/api/admin/offers/') && method === 'PUT') {
                    const id = Number(pathname.replace('/api/admin/offers/', ''));
                    const body = await parseRequestBody(req);
                    const updated = DB.updateOffer(id, body);
                    return sendJSON(res, 200, { success: true, offer: updated });
                }

                if (pathname.includes('/toggle') && method === 'PATCH') {
                    const parts = pathname.split('/');
                    const id = Number(parts[parts.length - 2]);
                    const body = await parseRequestBody(req);
                    DB.toggleOfferStatus(id, body.is_active);
                    return sendJSON(res, 200, { success: true, message: 'Offer status updated' });
                }

                if (pathname.startsWith('/api/admin/offers/') && method === 'DELETE') {
                    const id = Number(pathname.replace('/api/admin/offers/', ''));
                    DB.deleteOffer(id);
                    return sendJSON(res, 200, { success: true, message: 'Offer deleted' });
                }

                // 19. Admin Orders
                if (pathname === '/api/admin/orders' && method === 'GET') {
                    const orders = DB.getAllOrders();
                    return sendJSON(res, 200, { success: true, orders });
                }

                // 20. Admin Registered Customers
                if (pathname === '/api/admin/customers' && method === 'GET') {
                    const customers = DB.getAllCustomers();
                    return sendJSON(res, 200, { success: true, customers });
                }

                if (pathname.includes('/status') && method === 'PATCH') {
                    const parts = pathname.split('/');
                    const id = parts[parts.length - 2];
                    const body = await parseRequestBody(req);
                    const updated = DB.updateOrderStatus(id, body.status, body.note);
                    return sendJSON(res, 200, { success: true, order: updated });
                }

                // 20. Admin Image Upload (Base64 data or URL)
                if (pathname === '/api/admin/upload' && method === 'POST') {
                    const body = await parseRequestBody(req);
                    const { base64Data, filename } = body;

                    if (!base64Data) {
                        return sendError(res, 400, 'No image data provided');
                    }

                    // Extract format
                    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    if (!matches || matches.length !== 3) {
                        return sendError(res, 400, 'Invalid base64 image data');
                    }

                    const ext = matches[1].split('/')[1] || 'jpg';
                    const buffer = Buffer.from(matches[2], 'base64');
                    const safeName = `hf-prod-${Date.now()}-${Math.floor(Math.random()*1000)}.${ext}`;
                    const targetPath = path.join(UPLOADS_DIR, safeName);

                    fs.writeFileSync(targetPath, buffer);
                    const fileUrl = `/uploads/${safeName}`;

                    return sendJSON(res, 200, { success: true, url: fileUrl });
                }
            }

            // Unmatched API endpoint
            return sendError(res, 404, 'API endpoint not found');
        } catch (err) {
            console.error('[API Error]', err);
            return sendError(res, 500, err.message || 'Internal Server Error');
        }
    }

    // ----------------------------------------------------------------------
    // STATIC FILE SERVING
    // ----------------------------------------------------------------------
    let reqUrl = pathname;
    if (reqUrl === '/') reqUrl = '/index.html';
    if (reqUrl === '/admin') reqUrl = '/admin.html';
    if (reqUrl === '/dashboard') reqUrl = '/customer.html';

    const filePath = path.join(__dirname, reqUrl);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`HUSNAIN FASHION - Secure Production Server Live`);
    console.log(`Storefront:         http://localhost:${PORT}`);
    console.log(`Admin Panel:        http://localhost:${PORT}/admin.html`);
    console.log(`Customer Dashboard: http://localhost:${PORT}/customer.html`);
    console.log(`Database:           node:sqlite (WAL mode enabled)`);
    console.log(`================================================================`);
});
