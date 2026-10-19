const path = require('path');
const fs = require('fs');
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
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);
        `);
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
            revolut_reference,
            total_cigs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
        orderCode,
        customerName,
        deliveryDate,
        deliveryNotes,
        itemsJson,
        grandTotal,
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
        revolutReference: row.revolut_reference,
        totalCigs: Number(row.total_cigs),
        createdAt: row.created_at
    };
}

module.exports = {
    getDb,
    getDatabasePath,
    insertOrder,
    getRecentOrders,
    getOrderByCode
};
