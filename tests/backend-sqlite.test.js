const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const db = require('../api/_db.js');
const handler = require('../api/orders.js');

test('SQLite Database Module Tests', async (t) => {
    await t.test('database path and schema initialization', () => {
        const dbPath = db.getDatabasePath();
        assert.ok(dbPath, 'Database path should be defined');
        const dbConn = db.getDb();
        assert.ok(dbConn, 'Database instance should exist');

        // Check tables exist
        const checkTable = dbConn.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'");
        const result = checkTable.get();
        assert.equal(result.name, 'orders', 'Orders table must exist in schema');
    });

    await t.test('insertOrder and getRecentOrders', () => {
        const uniqueCode = 'TEST-UNIT-' + Date.now();
        const testOrder = {
            orderCode: uniqueCode,
            customerName: 'Alice Testing',
            deliveryDate: '2026-10-30',
            deliveryNotes: 'Near Luxembourg Central',
            items: [
                { brand: 'Camel', model: 'Yellow Carton', qty: 2, subtotal: 120, totalCigs: 400 },
                { brand: 'Drum', model: 'Original Blue 50g', qty: 2, subtotal: 30, totalCigs: 100 }
            ],
            grandTotal: 150,
            revolutReference: 'REV-ALICE-1',
            totalCigs: 500
        };

        const inserted = db.insertOrder(testOrder);
        assert.ok(inserted.id, 'Inserted order must have an id');
        assert.equal(inserted.orderCode, uniqueCode);
        assert.equal(inserted.customerName, 'Alice Testing');
        assert.equal(inserted.grandTotal, 150);
        assert.equal(inserted.totalCigs, 500);
        assert.equal(inserted.items.length, 2);

        // Verify retrieval by code
        const fetched = db.getOrderByCode(uniqueCode);
        assert.ok(fetched, 'Must fetch order by code');
        assert.equal(fetched.orderCode, uniqueCode);

        // Verify in recent orders
        const recents = db.getRecentOrders(10);
        assert.ok(recents.length > 0, 'Recent orders list must not be empty');
        const match = recents.find(o => o.orderCode === uniqueCode);
        assert.ok(match, 'Inserted order should appear in recent orders');
    });
});

test('Serverless /api/orders Handler Tests', async (t) => {
    db.getDb().exec('DELETE FROM orders;');
    function createMockRes() {
        return {
            statusCode: 200,
            headers: {},
            body: null,
            setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
            status(code) { this.statusCode = code; return this; },
            json(data) { this.body = data; return this; },
            end() { return this; }
        };
    }

    await t.test('OPTIONS preflight request', async () => {
        const req = { method: 'OPTIONS', headers: { host: 'localhost:3000' } };
        const res = createMockRes();
        await handler(req, res);

        assert.equal(res.statusCode, 204);
        assert.equal(res.headers['access-control-allow-origin'], '*');
    });

    await t.test('GET /api/orders returns orders array', async () => {
        const req = { method: 'GET', url: '/api/orders?limit=10', headers: { host: 'localhost:3000' } };
        const res = createMockRes();
        await handler(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.orders));
    });

    await t.test('POST /api/orders successfully creates order', async () => {
        const code = 'API-TEST-' + Date.now();
        const req = {
            method: 'POST',
            url: '/api/orders',
            headers: { host: 'localhost:3000' },
            body: {
                orderCode: code,
                customerName: 'Bob Builder',
                deliveryDate: '2026-11-01',
                items: [{ brand: 'Winston', model: 'Classic', qty: 1, subtotal: 58, totalCigs: 200 }],
                grandTotal: 58,
                revolutReference: 'REV-BOB',
                totalCigs: 200
            }
        };
        const res = createMockRes();
        await handler(req, res);

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.success, true);
        assert.equal(res.body.order.orderCode, code);
        assert.equal(res.body.order.grandTotal, 58);
    });

    await t.test('POST /api/orders rejects invalid payload without items', async () => {
        const req = {
            method: 'POST',
            url: '/api/orders',
            headers: { host: 'localhost:3000' },
            body: {
                customerName: 'Invalid Order',
                items: [],
                grandTotal: 100
            }
        };
        const res = createMockRes();
        await handler(req, res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.error, /at least one item/i);
    });

    await t.test('PUT /api/orders returns 405 Method Not Allowed', async () => {
        const req = { method: 'PUT', url: '/api/orders', headers: { host: 'localhost:3000' } };
        const res = createMockRes();
        await handler(req, res);

        assert.equal(res.statusCode, 405);
        assert.equal(res.body.success, false);
    });
});
