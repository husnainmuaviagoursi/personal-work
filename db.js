// ==========================================================================
// HUSNAIN FASHION - Secure Database Engine (node:sqlite)
// Provides ACID-compliant relational storage, salted crypto hashing, & seed data
// ==========================================================================

const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new DatabaseSync(DB_PATH);

// Initialize Tables
function initDatabase() {
    db.exec(`
        PRAGMA journal_mode = WAL;

        -- Users Table (Customers & Admins)
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            city TEXT,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            role TEXT DEFAULT 'customer',
            reset_code TEXT,
            reset_code_expiry INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Saved Addresses Table
        CREATE TABLE IF NOT EXISTS addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            label TEXT DEFAULT 'Home',
            recipient_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            address_line TEXT NOT NULL,
            city TEXT NOT NULL,
            postal_code TEXT,
            is_default INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Products Table
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            sub_category TEXT NOT NULL,
            season TEXT NOT NULL,
            original_price REAL NOT NULL,
            discount_price REAL NOT NULL,
            discount_badge TEXT,
            rating REAL DEFAULT 4.9,
            reviews_count INTEGER DEFAULT 0,
            is_bestseller INTEGER DEFAULT 0,
            is_new_arrival INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            description TEXT,
            fabric TEXT,
            fit TEXT,
            care TEXT,
            images_json TEXT NOT NULL,
            colors_json TEXT NOT NULL,
            sizes_json TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Special Offers & Coupons Table
        CREATE TABLE IF NOT EXISTS offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL, -- 'percentage', 'bogo', 'buy2_10', 'buy3_20', 'free_shipping'
            discount_percent REAL DEFAULT 0,
            min_order_amount REAL DEFAULT 0,
            scope TEXT DEFAULT 'storewide', -- 'storewide', 'shirts', 'winter', 'trousers'
            start_date TEXT NOT NULL,
            expiry_date TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Orders Table
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id INTEGER,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            address_line TEXT NOT NULL,
            city TEXT NOT NULL,
            postal_code TEXT,
            items_json TEXT NOT NULL,
            subtotal REAL NOT NULL,
            discount_amount REAL DEFAULT 0,
            delivery_fee REAL DEFAULT 0,
            grand_total REAL NOT NULL,
            coupon_code TEXT,
            payment_method TEXT NOT NULL,
            payment_status TEXT DEFAULT 'Pending',
            order_status TEXT DEFAULT 'Processing', -- 'Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'
            courier_name TEXT DEFAULT 'TCS Express Pakistan',
            tracking_history_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- User Wishlist Table
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, product_id)
        );
    `);

    seedDefaultData();
}

// Cryptographic Password Hashing (Salt + Scrypt)
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { salt, hash };
}

function verifyPassword(password, salt, storedHash) {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

// Seed initial users, products, offers and orders
function seedDefaultData() {
    // 1. Seed Admin User (Husnain Admin)
    const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@husnainfashion.pk');
    if (!adminExists) {
        const { salt, hash } = hashPassword('HusnainAdmin2026!');
        db.prepare(`
            INSERT INTO users (name, email, phone, city, password_hash, salt, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run('Husnain Admin', 'admin@husnainfashion.pk', '03004876246', 'Lahore', hash, salt, 'admin');
        console.log('[DB] Admin user verified: admin@husnainfashion.pk');
    }

    // 2. Sync Real Products from products.js (Only if not already present)
    try {
        const productsJsPath = path.join(__dirname, 'js', 'products.js');
        if (fs.existsSync(productsJsPath)) {
            const fileContent = fs.readFileSync(productsJsPath, 'utf8');
            const vm = require('vm');
            const context = {};
            vm.createContext(context);
            const extracted = vm.runInContext(fileContent + '\n;({ PRODUCTS_DATA });', context);
            
            if (extracted && extracted.PRODUCTS_DATA) {
                const checkStmt = db.prepare('SELECT id FROM products WHERE id = ?');
                const insertStmt = db.prepare(`
                    INSERT INTO products (
                        id, name, category, sub_category, season, original_price, discount_price, 
                        discount_badge, rating, reviews_count, is_bestseller, is_new_arrival, is_active,
                        description, fabric, fit, care, images_json, colors_json, sizes_json
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                let seededCount = 0;
                for (const p of extracted.PRODUCTS_DATA) {
                    if (!checkStmt.get(p.id)) {
                        insertStmt.run(
                            p.id,
                            p.name,
                            p.category,
                            p.subCategory,
                            p.season,
                            p.originalPrice,
                            p.discountPrice,
                            p.discountBadge || '',
                            p.rating || 4.9,
                            p.reviewsCount || 50,
                            p.isBestseller ? 1 : 0,
                            p.isNewArrival ? 1 : 0,
                            1,
                            p.description,
                            p.fabric,
                            p.fit,
                            p.care,
                            JSON.stringify(p.images),
                            JSON.stringify(p.colors),
                            JSON.stringify(p.sizes)
                        );
                        seededCount++;
                    }
                }
                if (seededCount > 0) {
                    console.log(`[DB] Seeded ${seededCount} products into SQLite.`);
                }
            }
        }
    } catch (e) {
        console.error('[DB] Error syncing products:', e);
    }

    // 3. Seed Promotional Offers & Coupons (Real store deals)
    const offersCount = db.prepare('SELECT COUNT(*) as count FROM offers').get().count;
    if (offersCount === 0) {
        const insertOffer = db.prepare(`
            INSERT INTO offers (code, title, description, type, discount_percent, min_order_amount, scope, start_date, expiry_date, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insertOffer.run('WINTER20', 'Winter 20% OFF Clearance', 'Flat 20% discount on all winter coats, blazers, and overcoats', 'percentage', 20, 0, 'winter', '2026-01-01', '2026-12-31', 1);
        insertOffer.run('SUMMER20', 'Summer 20% OFF Special', 'Flat 20% discount on summer cotton and casual shirts', 'percentage', 20, 0, 'shirts', '2026-01-01', '2026-12-31', 1);
        insertOffer.run('WINTER30', 'Winter 30% OFF Flash Sale', 'Extra 30% discount on premium outerwear over Rs. 10,000', 'percentage', 30, 10000, 'winter', '2026-01-01', '2026-12-31', 1);
        insertOffer.run('HUSNAIN10', 'Welcome 10% Storewide', '10% discount across all garments for gentlemen', 'percentage', 10, 0, 'storewide', '2026-01-01', '2026-12-31', 1);
        insertOffer.run('WEEKEND15', 'Special Weekend 15% OFF', '15% discount for weekend shoppers across Pakistan', 'percentage', 15, 3000, 'storewide', '2026-01-01', '2026-12-31', 1);
        insertOffer.run('BOGO2026', 'Buy 1 Get 1 Free (Select Garments)', 'Buy any luxury shirt or chinos and get the second free', 'bogo', 50, 2000, 'shirts', '2026-01-01', '2026-12-31', 1);
        insertOffer.run('FREEDELIVERY', 'Free Nationwide Delivery', 'Zero delivery charges anywhere across Pakistan', 'free_shipping', 0, 0, 'storewide', '2026-01-01', '2026-12-31', 1);

        console.log('[DB] Seeded promotional offers and coupons.');
    }
}

// Helper query wrappers
const DB = {
    db,
    hashPassword,
    verifyPassword,

    // Users
    getAllCustomers() {
        return db.prepare(`
            SELECT u.id, u.name, u.email, u.phone, u.city, u.created_at,
                   COUNT(o.id) as orders_count,
                   COALESCE(SUM(o.grand_total), 0) as total_spent
            FROM users u
            LEFT JOIN orders o ON (o.user_id = u.id OR o.customer_email = u.email)
            WHERE u.role = 'customer'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `).all();
    },
    getUserByEmail(email) {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    },
    getUserById(id) {
        return db.prepare('SELECT id, name, email, phone, city, role, created_at FROM users WHERE id = ?').get(id);
    },
    createUser(name, email, phone, city, password, role = 'customer') {
        const { salt, hash } = hashPassword(password);
        const res = db.prepare(`
            INSERT INTO users (name, email, phone, city, password_hash, salt, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(name, email, phone || '', city || '', hash, salt, role);
        return DB.getUserById(Number(res.lastInsertRowid));
    },
    updateUserProfile(id, name, phone, city) {
        db.prepare('UPDATE users SET name = ?, phone = ?, city = ? WHERE id = ?').run(name, phone, city, id);
        return DB.getUserById(id);
    },
    updateUserPassword(id, newPassword) {
        const { salt, hash } = hashPassword(newPassword);
        db.prepare('UPDATE users SET password_hash = ?, salt = ? WHERE id = ?').run(hash, salt, id);
    },
    setResetCode(email, code, expiry) {
        db.prepare('UPDATE users SET reset_code = ?, reset_code_expiry = ? WHERE email = ?').run(code, expiry, email);
    },

    // Addresses
    getUserAddresses(userId) {
        return db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC').all(userId);
    },
    addAddress(userId, label, name, phone, address, city, postal, isDefault) {
        if (isDefault) {
            db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(userId);
        }
        const res = db.prepare(`
            INSERT INTO addresses (user_id, label, recipient_name, phone, address_line, city, postal_code, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(userId, label, name, phone, address, city, postal || '', isDefault ? 1 : 0);
        return Number(res.lastInsertRowid);
    },
    deleteAddress(addressId, userId) {
        db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(addressId, userId);
    },

    // Products
    getAllProducts(includeInactive = false) {
        const sql = includeInactive 
            ? 'SELECT * FROM products ORDER BY created_at DESC' 
            : 'SELECT * FROM products WHERE is_active = 1 ORDER BY is_bestseller DESC, created_at DESC';
        const rows = db.prepare(sql).all();
        return rows.map(r => ({
            ...r,
            subCategory: r.sub_category,
            originalPrice: r.original_price,
            discountPrice: r.discount_price,
            discountBadge: r.discount_badge,
            reviewsCount: r.reviews_count,
            isBestseller: !!r.is_bestseller,
            isNewArrival: !!r.is_new_arrival,
            images: JSON.parse(r.images_json),
            colors: JSON.parse(r.colors_json),
            sizes: JSON.parse(r.sizes_json)
        }));
    },
    getProductById(id) {
        const r = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (!r) return null;
        return {
            ...r,
            subCategory: r.sub_category,
            originalPrice: r.original_price,
            discountPrice: r.discount_price,
            discountBadge: r.discount_badge,
            reviewsCount: r.reviews_count,
            isBestseller: !!r.is_bestseller,
            isNewArrival: !!r.is_new_arrival,
            images: JSON.parse(r.images_json),
            colors: JSON.parse(r.colors_json),
            sizes: JSON.parse(r.sizes_json)
        };
    },
    createProduct(p) {
        const subCat = p.sub_category || p.subCategory;
        const origPrice = p.original_price !== undefined ? p.original_price : p.originalPrice;
        const discPrice = p.discount_price !== undefined ? p.discount_price : p.discountPrice;
        const discBadge = p.discount_badge !== undefined ? p.discount_badge : (p.discountBadge || '');
        const isBest = p.is_bestseller !== undefined ? p.is_bestseller : p.isBestseller;
        const isNew = p.is_new_arrival !== undefined ? p.is_new_arrival : p.isNewArrival;
        const isActive = p.is_active !== undefined ? (p.is_active ? 1 : 0) : 1;

        db.prepare(`
            INSERT INTO products (
                id, name, category, sub_category, season, original_price, discount_price,
                discount_badge, rating, reviews_count, is_bestseller, is_new_arrival, is_active,
                description, fabric, fit, care, images_json, colors_json, sizes_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            p.id, p.name, p.category, subCat, p.season, origPrice, discPrice,
            discBadge, p.rating || 5.0, p.reviews_count || 0, isBest ? 1 : 0,
            isNew ? 1 : 0, isActive, p.description || '', p.fabric || '',
            p.fit || '', p.care || '', JSON.stringify(p.images || []), JSON.stringify(p.colors || []),
            JSON.stringify(p.sizes || [])
        );
        return DB.getProductById(p.id);
    },
    updateProduct(id, p) {
        const subCat = p.sub_category || p.subCategory;
        const origPrice = p.original_price !== undefined ? p.original_price : p.originalPrice;
        const discPrice = p.discount_price !== undefined ? p.discount_price : p.discountPrice;
        const discBadge = p.discount_badge !== undefined ? p.discount_badge : (p.discountBadge || '');
        const isBest = p.is_bestseller !== undefined ? p.is_bestseller : p.isBestseller;
        const isNew = p.is_new_arrival !== undefined ? p.is_new_arrival : p.isNewArrival;
        const isActive = p.is_active !== undefined ? (p.is_active ? 1 : 0) : 1;

        db.prepare(`
            UPDATE products SET
                name = ?, category = ?, sub_category = ?, season = ?, original_price = ?,
                discount_price = ?, discount_badge = ?, is_bestseller = ?, is_new_arrival = ?,
                is_active = ?, description = ?, fabric = ?, fit = ?, care = ?,
                images_json = ?, colors_json = ?, sizes_json = ?
            WHERE id = ?
        `).run(
            p.name, p.category, subCat, p.season, origPrice, discPrice,
            discBadge, isBest ? 1 : 0, isNew ? 1 : 0,
            isActive, p.description || '', p.fabric || '', p.fit || '', p.care || '',
            JSON.stringify(p.images || []), JSON.stringify(p.colors || []), JSON.stringify(p.sizes || []),
            id
        );
        return DB.getProductById(id);
    },
    deleteProduct(id) {
        db.prepare('DELETE FROM products WHERE id = ?').run(id);
    },

    // Offers
    getAllOffers(includeInactive = false) {
        const sql = includeInactive ? 'SELECT * FROM offers ORDER BY id DESC' : 'SELECT * FROM offers WHERE is_active = 1 ORDER BY id DESC';
        return db.prepare(sql).all();
    },
    getOfferByCode(code) {
        return db.prepare('SELECT * FROM offers WHERE code = ? AND is_active = 1').get(code.toUpperCase());
    },
    createOffer(o) {
        const res = db.prepare(`
            INSERT INTO offers (code, title, description, type, discount_percent, min_order_amount, scope, start_date, expiry_date, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            o.code.toUpperCase(), o.title, o.description || '', o.type, o.discount_percent || 0,
            o.min_order_amount || 0, o.scope || 'storewide', o.start_date, o.expiry_date, o.is_active !== undefined ? (o.is_active ? 1 : 0) : 1
        );
        return db.prepare('SELECT * FROM offers WHERE id = ?').get(Number(res.lastInsertRowid));
    },
    updateOffer(id, o) {
        db.prepare(`
            UPDATE offers SET
                code = ?, title = ?, description = ?, type = ?, discount_percent = ?,
                min_order_amount = ?, scope = ?, start_date = ?, expiry_date = ?, is_active = ?
            WHERE id = ?
        `).run(
            o.code.toUpperCase(), o.title, o.description || '', o.type, o.discount_percent || 0,
            o.min_order_amount || 0, o.scope || 'storewide', o.start_date, o.expiry_date, o.is_active ? 1 : 0,
            id
        );
        return db.prepare('SELECT * FROM offers WHERE id = ?').get(id);
    },
    toggleOfferStatus(id, isActive) {
        db.prepare('UPDATE offers SET is_active = ? WHERE id = ?').run(isActive ? 1 : 0, id);
    },
    deleteOffer(id) {
        db.prepare('DELETE FROM offers WHERE id = ?').run(id);
    },

    // Orders
    getAllOrders() {
        const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        return rows.map(r => ({
            ...r,
            items: JSON.parse(r.items_json),
            tracking_history: r.tracking_history_json ? JSON.parse(r.tracking_history_json) : []
        }));
    },
    getUserOrders(userId, email) {
        const rows = db.prepare('SELECT * FROM orders WHERE user_id = ? OR customer_email = ? ORDER BY created_at DESC').all(userId, email);
        return rows.map(r => ({
            ...r,
            items: JSON.parse(r.items_json),
            tracking_history: r.tracking_history_json ? JSON.parse(r.tracking_history_json) : []
        }));
    },
    getOrderById(id) {
        const r = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if (!r) return null;
        return {
            ...r,
            items: JSON.parse(r.items_json),
            tracking_history: r.tracking_history_json ? JSON.parse(r.tracking_history_json) : []
        };
    },
    createOrder(o) {
        const history = [
            { title: 'Order Placed online', time: 'Just Now' },
            { title: `Allocated to ${o.courier_name || 'TCS Express'} dispatch terminal`, time: 'Scheduled' }
        ];

        db.prepare(`
            INSERT INTO orders (
                id, user_id, customer_name, customer_email, customer_phone, address_line, city, postal_code,
                items_json, subtotal, discount_amount, delivery_fee, grand_total, coupon_code, payment_method,
                payment_status, order_status, courier_name, tracking_history_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            o.id, o.user_id || null, o.customer_name, o.customer_email, o.customer_phone,
            o.address_line, o.city, o.postal_code || '', JSON.stringify(o.items), o.subtotal,
            o.discount_amount || 0, o.delivery_fee || 0, o.grand_total, o.coupon_code || '',
            o.payment_method, o.payment_status || 'Pending', o.order_status || 'Processing',
            o.courier_name || 'TCS Express Pakistan', JSON.stringify(history)
        );

        return DB.getOrderById(o.id);
    },
    updateOrderStatus(id, newStatus, courierNote) {
        const order = DB.getOrderById(id);
        if (!order) return null;

        const history = order.tracking_history || [];
        const dateStr = new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        history.push({
            title: courierNote || `Status updated to ${newStatus}`,
            time: dateStr
        });

        db.prepare('UPDATE orders SET order_status = ?, tracking_history_json = ? WHERE id = ?').run(
            newStatus, JSON.stringify(history), id
        );
        return DB.getOrderById(id);
    },

    // Analytics
    getStats() {
        const totalSalesRow = db.prepare("SELECT COALESCE(SUM(grand_total), 0) as total_revenue, COUNT(*) as total_orders FROM orders WHERE order_status != 'Cancelled'").get();
        const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get().count;
        const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;
        const recentOrders = DB.getAllOrders().slice(0, 5);

        return {
            totalRevenue: Number(totalSalesRow.total_revenue || 0),
            totalOrders: Number(totalSalesRow.total_orders || 0),
            totalProducts: Number(totalProducts || 0),
            totalCustomers: Number(totalCustomers || 0),
            recentOrders: recentOrders || []
        };
    }
};

initDatabase();

module.exports = DB;
