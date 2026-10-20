const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const {
    getDb,
    validateAdminCredentials,
    createAdminSession,
    verifyAdminSession,
    deleteAdminSession,
    getAllSettings,
    updateSettings,
    getCoffeePromos,
    addCoffeePromo,
    deleteCoffeePromo,
    getCustomItems,
    addCustomItem,
    updateCustomItemPrice
} = require('../api/_db.js');

const adminHandler = require('../api/admin.js');
const settingsHandler = require('../api/settings.js');
const coffeePromosHandler = require('../api/coffee-promos.js');
const customItemsHandler = require('../api/custom-items.js');
const ordersHandler = require('../api/orders.js');

function createMockRes() {
    return {
        statusCode: 200,
        headers: {},
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        setHeader(k, v) {
            this.headers[k.toLowerCase()] = v;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        },
        end(data) {
            if (data) this.body = data;
            return this;
        }
    };
}

test('Bolt 007: Admin Portal, Settings & Back-Office Suite', async (t) => {
    // -------------------------------------------------------------------------
    // Story 001: Admin Authentication & Session Management
    // -------------------------------------------------------------------------
    await t.test('Story 001: validateAdminCredentials and session tokens', () => {
        // Credentials check
        assert.equal(validateAdminCredentials('admin', 'luxtabac2026!'), true);
        assert.equal(validateAdminCredentials('admin', 'wrongpass'), false);
        assert.equal(validateAdminCredentials('unknown', 'luxtabac2026!'), false);

        // Session creation & verification
        const token = createAdminSession('admin');
        assert.ok(token);
        assert.equal(typeof token, 'string');

        const session = verifyAdminSession(token);
        assert.ok(session);
        assert.equal(session.username, 'admin');

        // Delete session (logout)
        deleteAdminSession(token);
        assert.equal(verifyAdminSession(token), null);
    });

    await t.test('Story 001: /api/admin Serverless Handler (login, session, logout)', async () => {
        // Test Login with valid credentials
        const loginReq = {
            method: 'POST',
            url: '/api/admin/login',
            headers: {},
            body: { username: 'admin', password: 'luxtabac2026!' }
        };
        const loginRes = createMockRes();
        await adminHandler(loginReq, loginRes);
        assert.equal(loginRes.statusCode, 200);
        assert.equal(loginRes.body.success, true);
        const adminToken = loginRes.body.token;
        assert.ok(adminToken);

        // Test Login with invalid credentials
        const badLoginReq = {
            method: 'POST',
            url: '/api/admin/login',
            headers: {},
            body: { username: 'admin', password: 'badpassword' }
        };
        const badLoginRes = createMockRes();
        await adminHandler(badLoginReq, badLoginRes);
        assert.equal(badLoginRes.statusCode, 401);
        assert.equal(badLoginRes.body.success, false);

        // Test Session Check with valid token
        const checkReq = {
            method: 'GET',
            url: '/api/admin/session',
            headers: { authorization: `Bearer ${adminToken}` }
        };
        const checkRes = createMockRes();
        await adminHandler(checkReq, checkRes);
        assert.equal(checkRes.statusCode, 200);
        assert.equal(checkRes.body.authenticated, true);

        // Test Session Check without token
        const unauthReq = {
            method: 'GET',
            url: '/api/admin/session',
            headers: {}
        };
        const unauthRes = createMockRes();
        await adminHandler(unauthReq, unauthRes);
        assert.equal(unauthRes.statusCode, 401);

        // Test Logout
        const logoutReq = {
            method: 'POST',
            url: '/api/admin/logout',
            headers: { authorization: `Bearer ${adminToken}` }
        };
        const logoutRes = createMockRes();
        await adminHandler(logoutReq, logoutRes);
        assert.equal(logoutRes.statusCode, 200);

        // Verify session is now revoked
        const recheckRes = createMockRes();
        await adminHandler(checkReq, recheckRes);
        assert.equal(recheckRes.statusCode, 401);
    });

    // -------------------------------------------------------------------------
    // Story 002: Admin Settings Management
    // -------------------------------------------------------------------------
    await t.test('Story 002: Settings retrieval and authenticated updates', async () => {
        // Public GET /api/settings
        const getReq = { method: 'GET', url: '/api/settings', headers: {} };
        const getRes = createMockRes();
        await settingsHandler(getReq, getRes);
        assert.equal(getRes.statusCode, 200);
        assert.ok(getRes.body.settings);
        assert.ok(getRes.body.settings.revtag);

        // Unauthenticated PUT /api/settings should be rejected
        const unauthPutReq = {
            method: 'PUT',
            url: '/api/settings',
            headers: {},
            body: { revtag: 'hacker' }
        };
        const unauthPutRes = createMockRes();
        await settingsHandler(unauthPutReq, unauthPutRes);
        assert.equal(unauthPutRes.statusCode, 401);

        // Authenticated PUT /api/settings
        const token = createAdminSession('admin');
        const authPutReq = {
            method: 'PUT',
            url: '/api/settings',
            headers: { authorization: `Bearer ${token}` },
            body: {
                revtag: 'luxtabac_official',
                whatsappLink: 'https://wa.me/352691999888',
                coffeeVisible: false
            }
        };
        const authPutRes = createMockRes();
        await settingsHandler(authPutReq, authPutRes);
        assert.equal(authPutRes.statusCode, 200);
        assert.equal(authPutRes.body.settings.revtag, 'luxtabac_official');
        assert.equal(authPutRes.body.settings.whatsappLink, 'https://wa.me/352691999888');
        assert.equal(authPutRes.body.settings.coffeeVisible, false);

        // Restore default revtag
        updateSettings({ revtag: 'vladimtul', whatsappLink: 'https://wa.me/', coffeeVisible: true });
        deleteAdminSession(token);
    });

    // -------------------------------------------------------------------------
    // Story 003: Coffee Promo Cards & Custom Cigarette Items Pricing
    // -------------------------------------------------------------------------
    await t.test('Story 003: Coffee Promo CRUD with Admin Protection', async () => {
        // GET /api/coffee-promos (public)
        const getReq = { method: 'GET', url: '/api/coffee-promos', headers: {} };
        const getRes = createMockRes();
        await coffeePromosHandler(getReq, getRes);
        assert.equal(getRes.statusCode, 200);
        assert.ok(Array.isArray(getRes.body.items));
        assert.ok(getRes.body.items.length >= 4);

        // POST /api/coffee-promos unauthenticated -> 401
        const unauthReq = {
            method: 'POST',
            url: '/api/coffee-promos',
            headers: {},
            body: { brand: 'Test Brand', title: 'Test Coffee', price: 9.99 }
        };
        const unauthRes = createMockRes();
        await coffeePromosHandler(unauthReq, unauthRes);
        assert.equal(unauthRes.statusCode, 401);

        // POST /api/coffee-promos authenticated -> 201
        const token = createAdminSession('admin');
        const authReq = {
            method: 'POST',
            url: '/api/coffee-promos',
            headers: { authorization: `Bearer ${token}` },
            body: {
                brand: 'Illy Test',
                title: 'Espresso Classic Roast',
                qty: '50 Capsules',
                format: 'Nespresso Compatible',
                price: 12.50,
                badge: 'Exclusive',
                highlight: '100% Arabica'
            }
        };
        const authRes = createMockRes();
        await coffeePromosHandler(authReq, authRes);
        assert.equal(authRes.statusCode, 201);
        const createdId = authRes.body.item.id;
        assert.ok(createdId);

        // DELETE /api/coffee-promos authenticated -> 200
        const delReq = {
            method: 'DELETE',
            url: `/api/coffee-promos?id=${createdId}`,
            headers: { authorization: `Bearer ${token}` }
        };
        const delRes = createMockRes();
        await coffeePromosHandler(delReq, delRes);
        assert.equal(delRes.statusCode, 200);
        assert.equal(delRes.body.deleted, true);

        deleteAdminSession(token);
    });

    await t.test('Story 003: Custom Cigarette Items and Admin Price Adjustments', async () => {
        // Buyer creates custom item
        const postReq = {
            method: 'POST',
            url: '/api/custom-items',
            headers: {},
            body: {
                brand: 'Gauloises',
                model: 'Brune Sans Filtre',
                createdBy: 'TestBuyer'
            }
        };
        const postRes = createMockRes();
        await customItemsHandler(postReq, postRes);
        assert.equal(postRes.statusCode, 201);
        const itemId = postRes.body.item.id;
        assert.equal(postRes.body.item.brand, 'Gauloises');
        assert.equal(postRes.body.item.model, 'Brune Sans Filtre');

        // Public GET /api/custom-items contains the newly added item
        const getReq = { method: 'GET', url: '/api/custom-items', headers: {} };
        const getRes = createMockRes();
        await customItemsHandler(getReq, getRes);
        assert.equal(getRes.statusCode, 200);
        const match = getRes.body.items.find(i => i.id === itemId);
        assert.ok(match);

        // Unauthenticated price update -> 401
        const unauthPut = {
            method: 'PUT',
            url: '/api/custom-items',
            headers: {},
            body: { id: itemId, packPrice: 8.90, cartonPrice: 88.00 }
        };
        const unauthPutRes = createMockRes();
        await customItemsHandler(unauthPut, unauthPutRes);
        assert.equal(unauthPutRes.statusCode, 401);

        // Authenticated admin price adjustment -> 200
        const token = createAdminSession('admin');
        const authPut = {
            method: 'PUT',
            url: '/api/custom-items',
            headers: { authorization: `Bearer ${token}` },
            body: { id: itemId, packPrice: 8.90, cartonPrice: 88.00 }
        };
        const authPutRes = createMockRes();
        await customItemsHandler(authPut, authPutRes);
        assert.equal(authPutRes.statusCode, 200);
        assert.equal(authPutRes.body.item.packPrice, 8.90);
        assert.equal(authPutRes.body.item.cartonPrice, 88.00);

        deleteAdminSession(token);
    });

    await t.test('Story 003: POST /api/orders automatically persists custom items', async () => {
        getDb().exec('DELETE FROM orders;');
        const orderReq = {
            method: 'POST',
            url: '/api/orders',
            headers: {},
            body: {
                name: 'Custom Tobacco Collector',
                brand: 'Gitanes',
                model: 'Filtre Bleue',
                format: 'pack',
                formatLabel: 'Single Pack (20 Cigs)',
                qty: 1,
                packPrice: 7.80,
                cartonPrice: 78.00,
                unitPrice: 7.80,
                items: [
                    {
                        brand: 'Gitanes',
                        model: 'Filtre Bleue',
                        format: 'pack',
                        formatLabel: 'Single Pack (20 Cigs)',
                        isManual: true,
                        qty: 1,
                        unitPrice: 7.80,
                        subtotal: 7.80,
                        cigsCount: 20
                    }
                ],
                tipAmount: 0,
                grandTotal: 7.80,
                revolutReference: 'REF-CUSTOM-TEST'
            }
        };
        const orderRes = createMockRes();
        await ordersHandler(orderReq, orderRes);
        assert.equal(orderRes.statusCode, 201);

        // Verify it was added to custom_items
        const customs = getCustomItems();
        const gitanes = customs.find(c => c.brand.toLowerCase() === 'gitanes');
        assert.ok(gitanes);
        assert.equal(gitanes.model, 'Filtre Bleue');
    });

    // -------------------------------------------------------------------------
    // Frontend Elements Verification
    // -------------------------------------------------------------------------
    await t.test('Frontend Admin & Back-Office DOM Elements in index.html', () => {
        const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

        // Header Admin Trigger
        assert.ok(html.includes('id="btn-open-admin"'), 'btn-open-admin trigger exists');
        assert.ok(html.includes('id="admin-badge-indicator"'), 'admin-badge-indicator exists');

        // Admin Login Modal
        assert.ok(html.includes('id="admin-login-modal"'), 'admin-login-modal exists');
        assert.ok(html.includes('id="admin-username"'), 'admin-username input exists');
        assert.ok(html.includes('id="admin-password"'), 'admin-password input exists');
        assert.ok(html.includes('id="admin-login-form"'), 'admin-login-form exists');

        // Admin Backoffice Modal with 3 Tabs
        assert.ok(html.includes('id="admin-backoffice-modal"'), 'admin-backoffice-modal exists');
        assert.ok(html.includes('id="tab-btn-settings"'), 'tab-btn-settings exists');
        assert.ok(html.includes('id="tab-btn-coffee"'), 'tab-btn-coffee exists');
        assert.ok(html.includes('id="tab-btn-custom-items"'), 'tab-btn-custom-items exists');

        // Admin Settings Inputs
        assert.ok(html.includes('id="admin-setting-revtag"'), 'admin-setting-revtag exists');
        assert.ok(html.includes('id="admin-setting-whatsapp"'), 'admin-setting-whatsapp exists');
        assert.ok(html.includes('id="admin-setting-coffee-toggle"'), 'admin-setting-coffee-toggle exists');
        assert.ok(html.includes('id="btn-save-admin-settings"'), 'btn-save-admin-settings exists');

        // Admin Coffee & Custom Elements
        assert.ok(html.includes('id="admin-coffee-items-list"'), 'admin-coffee-items-list exists');
        assert.ok(html.includes('id="admin-custom-items-container"'), 'admin-custom-items-container exists');
        assert.ok(html.includes('id="coffee-cards-grid"'), 'coffee-cards-grid exists');
    });
});
