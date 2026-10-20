const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

let dbInstance = null;

/**
 * Determine the appropriate SQLite file path depending on runtime environment.
 * On Vercel / serverless lambda, the writable location is `/tmp/`.
 * Locally, it persists in `./data/luxtabac.db`.
 */
function getDatabasePath() {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        return '/tmp/luxtabac.db';
    }
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    return path.join(dataDir, 'luxtabac.db');
}

/**
 * Get or initialize the database connection singleton.
 */
function getDb() {
    if (!dbInstance) {
        const dbPath = getDatabasePath();
        dbInstance = new DatabaseSync(dbPath);

        // Enable Write-Ahead Logging and busy timeout for high concurrency
        dbInstance.exec('PRAGMA journal_mode = WAL;');
        dbInstance.exec('PRAGMA busy_timeout = 5000;');

        // Auto-migrate schema on initial boot
        dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_code TEXT UNIQUE NOT NULL,
                customer_name TEXT NOT NULL,
                delivery_date TEXT,
                delivery_notes TEXT,
                items_json TEXT NOT NULL,
                grand_total REAL NOT NULL,
                revolut_reference TEXT,
                total_cigs INTEGER DEFAULT 0,
                tip_amount REAL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);

            CREATE TABLE IF NOT EXISTS app_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS admin_sessions (
                token TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS coffee_promos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                brand TEXT NOT NULL,
                title TEXT NOT NULL,
                pack_quantity TEXT,
                format TEXT,
                price REAL NOT NULL,
                badge TEXT,
                highlight TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS custom_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                brand TEXT NOT NULL,
                model TEXT NOT NULL,
                pack_price REAL DEFAULT 7.50,
                carton_price REAL DEFAULT 75.00,
                created_by TEXT DEFAULT 'Buyer',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        try {
            dbInstance.exec('ALTER TABLE orders ADD COLUMN tip_amount REAL DEFAULT 0;');
        } catch {
            // column already exists
        }

        // Seed default app_settings
        dbInstance.exec(`
            INSERT OR IGNORE INTO app_settings (key, value) VALUES 
            ('revtag', 'vladimtul'),
            ('whatsapp_link', 'https://wa.me/'),
            ('coffee_visible', '1');
        `);

        // Seed default coffee promos if empty
        const promoCount = dbInstance.prepare('SELECT COUNT(*) AS c FROM coffee_promos').get().c;
        if (promoCount === 0) {
            dbInstance.exec(`
                INSERT INTO coffee_promos (brand, title, pack_quantity, format, price, badge, highlight) VALUES
                ('Lavazza', 'Qualità Rossa / Crema e Gusto', '36 Pods (Economy Pack)', 'A Modo Mio / Nespresso Compatible', 9.50, 'Border Value', 'Rich Italian Roast • €0.26 / cup'),
                ('Nespresso', 'Master Origin & Ispirazione Italiana', '50 Pods (5 Sleeves)', 'OriginalLine Aluminum Capsules', 21.00, 'Luxembourg Tarif', 'Dark Roast & Velvet Crema • Official LU Price'),
                ('Senseo', 'Classique & Corsé Mega Box', '60 Soft Pods', 'Compostable Filter Pads', 11.20, 'Volume Choice', '100% Arabica Blend • Daily Driver'),
                ('Dolce Gusto', 'Espresso Intenso & Lungo', '30 Pods', 'Hermetic Smart Pods', 8.90, 'Popular', 'Intense Aroma • Rich Crema Layer');
            `);
        }
    }
    return dbInstance;
}

/**
 * Persist an order into the SQLite database.
 */
function insertOrder(order) {
    const db = getDb();
    const itemsJson = typeof order.items === 'string' 
        ? order.items 
        : JSON.stringify(order.items || []);

    const orderCode = order.orderCode || `LU-${Date.now().toString(36).toUpperCase()}`;
    const customerName = String(order.customerName || 'Anonymous').trim();
    const deliveryDate = order.deliveryDate ? String(order.deliveryDate).trim() : null;
    const deliveryNotes = order.deliveryNotes ? String(order.deliveryNotes).trim() : null;
    const grandTotal = Number(order.grandTotal) || 0;
    const tipAmount = Number(order.tipAmount) || 0;
    const revolutReference = order.revolutReference ? String(order.revolutReference).trim() : null;
    const totalCigs = Number(order.totalCigs) || 0;

    const insertStmt = db.prepare(`
        INSERT INTO orders (
            order_code,
            customer_name,
            delivery_date,
            delivery_notes,
            items_json,
            grand_total,
            tip_amount,
            revolut_reference,
            total_cigs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
        orderCode,
        customerName,
        deliveryDate,
        deliveryNotes,
        itemsJson,
        grandTotal,
        tipAmount,
        revolutReference,
        totalCigs
    );

    return getOrderByCode(orderCode);
}

/**
 * Retrieve recent orders ordered by latest first.
 */
function getRecentOrders(limit = 50) {
    const db = getDb();
    const queryStmt = db.prepare(`
        SELECT * FROM orders
        ORDER BY created_at DESC, id DESC
        LIMIT ?
    `);

    const rows = queryStmt.all(Number(limit) || 50);

    return rows.map(row => {
        let items = [];
        try {
            items = JSON.parse(row.items_json);
        } catch {
            items = [];
        }
        return {
            id: row.id,
            orderCode: row.order_code,
            customerName: row.customer_name,
            deliveryDate: row.delivery_date,
            deliveryNotes: row.delivery_notes,
            items: items,
            grandTotal: Number(row.grand_total),
            tipAmount: Number(row.tip_amount) || 0,
            revolutReference: row.revolut_reference,
            totalCigs: Number(row.total_cigs),
            createdAt: row.created_at
        };
    });
}

/**
 * Retrieve a single order by its unique order code.
 */
function getOrderByCode(orderCode) {
    const db = getDb();
    const selectStmt = db.prepare(`
        SELECT * FROM orders
        WHERE order_code = ?
        LIMIT 1
    `);

    const row = selectStmt.get(orderCode);
    if (!row) return null;

    let items = [];
    try {
        items = JSON.parse(row.items_json);
    } catch {
        items = [];
    }

    return {
        id: row.id,
        orderCode: row.order_code,
        customerName: row.customer_name,
        deliveryDate: row.delivery_date,
        deliveryNotes: row.delivery_notes,
        items: items,
        grandTotal: Number(row.grand_total),
        tipAmount: Number(row.tip_amount) || 0,
        revolutReference: row.revolut_reference,
        totalCigs: Number(row.total_cigs),
        createdAt: row.created_at
    };
}

/**
 * Calculate the start of the current calendar week (Monday at 00:00:00).
 */
function getWeekStartMonday(refDate = new Date()) {
    const d = new Date(refDate);
    const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Calculate the next Monday at 00:00:00 when the weekly quota resets.
 */
function getNextMonday(refDate = new Date()) {
    const monday = getWeekStartMonday(refDate);
    const next = new Date(monday);
    next.setDate(next.getDate() + 7);
    next.setHours(0, 0, 0, 0);
    return next;
}

/**
 * Query the total cigarettes booked in orders since the current week's Monday at 00:00:00.
 */
function getWeeklyCigaretteTotal(refDate = new Date()) {
    const db = getDb();
    const monday = getWeekStartMonday(refDate);
    const sinceSqlite = monday.toISOString().replace('T', ' ').substring(0, 19);
    const stmt = db.prepare(`
        SELECT COALESCE(SUM(total_cigs), 0) AS total_used
        FROM orders
        WHERE datetime(created_at) >= datetime(?)
    `);
    const row = stmt.get(sinceSqlite);
    return row ? Number(row.total_used) : 0;
}

/**
 * Retrieve comprehensive weekly quota status and allowance telemetry.
 */
function getQuotaStatus(refDate = new Date()) {
    const weeklyLimit = 800;
    const currentUsed = getWeeklyCigaretteTotal(refDate);
    const remaining = Math.max(0, weeklyLimit - currentUsed);
    const resetTimestamp = getNextMonday(refDate).toISOString();
    return {
        weeklyLimit,
        currentUsed,
        remaining,
        resetTimestamp,
        isFull: currentUsed >= weeklyLimit
    };
}

// =========================================================================
// SETTINGS MANAGEMENT (Story 002)
// =========================================================================

function getAllSettings() {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM app_settings').all();
    const map = {};
    rows.forEach(r => { map[r.key] = r.value; });
    return {
        revtag: map.revtag || 'vladimtul',
        whatsappLink: map.whatsapp_link || 'https://wa.me/',
        coffeeVisible: map.coffee_visible !== '0'
    };
}

function updateSettings(updates = {}) {
    const db = getDb();
    const upsert = db.prepare('INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
    if (typeof updates.revtag !== 'undefined') upsert.run('revtag', String(updates.revtag).trim());
    if (typeof updates.whatsappLink !== 'undefined') upsert.run('whatsapp_link', String(updates.whatsappLink).trim());
    if (typeof updates.coffeeVisible !== 'undefined') upsert.run('coffee_visible', updates.coffeeVisible ? '1' : '0');
    return getAllSettings();
}

// =========================================================================
// ADMIN AUTHENTICATION & SESSIONS (Story 001)
// =========================================================================

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'luxtabac2026!';

function validateAdminCredentials(username, password) {
    return String(username).trim() === ADMIN_USER && String(password) === ADMIN_PASSWORD;
}

function createAdminSession(username) {
    const db = getDb();
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare('INSERT INTO admin_sessions (token, username) VALUES (?, ?)').run(token, username);
    return token;
}

function verifyAdminSession(token) {
    if (!token) return null;
    const db = getDb();
    const session = db.prepare('SELECT token, username, created_at FROM admin_sessions WHERE token = ?').get(token);
    return session || null;
}

function deleteAdminSession(token) {
    if (!token) return;
    const db = getDb();
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
}

function extractBearerToken(req) {
    const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^bearer$/i.test(parts[0])) {
        return parts[1];
    }
    return null;
}

// =========================================================================
// COFFEE PROMOS CRUD (Story 003)
// =========================================================================

function getCoffeePromos() {
    const db = getDb();
    return db.prepare('SELECT id, brand, title, pack_quantity AS packQuantity, format, price, badge, highlight, created_at AS createdAt FROM coffee_promos ORDER BY id ASC').all();
}

function addCoffeePromo(item) {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO coffee_promos (brand, title, pack_quantity, format, price, badge, highlight)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
        item.brand || 'Coffee',
        item.title || '',
        item.packQuantity || '',
        item.format || '',
        Number(item.price) || 0,
        item.badge || 'New',
        item.highlight || ''
    );
    return db.prepare('SELECT id, brand, title, pack_quantity AS packQuantity, format, price, badge, highlight, created_at AS createdAt FROM coffee_promos WHERE id = ?').get(result.lastInsertRowid);
}

function deleteCoffeePromo(id) {
    const db = getDb();
    db.prepare('DELETE FROM coffee_promos WHERE id = ?').run(Number(id));
}

// =========================================================================
// CUSTOM BUYER ITEMS & ADMIN PRICING (Story 003)
// =========================================================================

function getCustomItems() {
    const db = getDb();
    return db.prepare('SELECT id, brand, model, pack_price AS packPrice, carton_price AS cartonPrice, created_by AS createdBy, created_at AS createdAt FROM custom_items ORDER BY id DESC').all();
}

function addCustomItem({ brand, model, packPrice = 7.50, cartonPrice = 75.00, createdBy = 'Buyer' }) {
    const db = getDb();
    const cleanBrand = String(brand).trim();
    const cleanModel = String(model).trim();
    const existing = db.prepare('SELECT id, brand, model, pack_price AS packPrice, carton_price AS cartonPrice FROM custom_items WHERE LOWER(brand) = LOWER(?) AND LOWER(model) = LOWER(?)').get(cleanBrand, cleanModel);
    if (existing) return existing;

    const stmt = db.prepare('INSERT INTO custom_items (brand, model, pack_price, carton_price, created_by) VALUES (?, ?, ?, ?, ?)');
    const res = stmt.run(cleanBrand, cleanModel, Number(packPrice) || 7.50, Number(cartonPrice) || 75.00, createdBy);
    return db.prepare('SELECT id, brand, model, pack_price AS packPrice, carton_price AS cartonPrice, created_by AS createdBy, created_at AS createdAt FROM custom_items WHERE id = ?').get(res.lastInsertRowid);
}

function updateCustomItemPrice(id, packPrice, cartonPrice) {
    const db = getDb();
    db.prepare('UPDATE custom_items SET pack_price = ?, carton_price = ? WHERE id = ?').run(Number(packPrice), Number(cartonPrice), Number(id));
    return db.prepare('SELECT id, brand, model, pack_price AS packPrice, carton_price AS cartonPrice, created_by AS createdBy, created_at AS createdAt FROM custom_items WHERE id = ?').get(Number(id));
}

module.exports = {
    getDb,
    getDatabasePath,
    insertOrder,
    getRecentOrders,
    getOrderByCode,
    getWeekStartMonday,
    getNextMonday,
    getWeeklyCigaretteTotal,
    getQuotaStatus,
    getAllSettings,
    updateSettings,
    validateAdminCredentials,
    createAdminSession,
    verifyAdminSession,
    deleteAdminSession,
    extractBearerToken,
    getCoffeePromos,
    addCoffeePromo,
    deleteCoffeePromo,
    getCustomItems,
    addCustomItem,
    updateCustomItemPrice
};


