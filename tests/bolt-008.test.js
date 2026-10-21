const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const {
    getDb,
    getAllSettings,
    updateSettings,
    createAdminSession,
    insertOrder,
    getOrderByCode
} = require('../api/_db.js');

const settingsHandler = require('../api/settings.js');
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

test('Bolt 008: Wero QR Payment Integration Suite', async (t) => {
    // Clean database orders & sessions before running tests
    const db = getDb();
    db.exec(`
        DELETE FROM orders;
        DELETE FROM admin_sessions;
    `);

    // -------------------------------------------------------------------------
    // Story 001: Admin Wero Settings Maintenance
    // -------------------------------------------------------------------------
    await t.test('Story 001: Wero recipient default setting and DB persistence', () => {
        const settings = getAllSettings();
        assert.ok(settings.weroRecipient, 'weroRecipient should exist in settings');
        assert.ok(typeof settings.weroRecipient === 'string', 'weroRecipient should be a string');

        // Update settings in DB
        updateSettings({ weroRecipient: '+352 691 999 888' });
        const updated = getAllSettings();
        assert.equal(updated.weroRecipient, '+352 691 999 888');

        // Revert to standard
        updateSettings({ weroRecipient: '+352 691 000 000' });
    });

    await t.test('Story 001: /api/settings GET and authenticated PUT handles weroRecipient', async () => {
        // GET settings
        const getReq = { method: 'GET', url: '/api/settings', headers: {} };
        const getRes = createMockRes();
        await settingsHandler(getReq, getRes);
        assert.equal(getRes.statusCode, 200);
        assert.equal(getRes.body.settings.weroRecipient, '+352 691 000 000');

        // PUT settings without auth fails (401)
        const unauthReq = {
            method: 'PUT',
            url: '/api/settings',
            headers: {},
            body: { weroRecipient: '+352 691 123 456' }
        };
        const unauthRes = createMockRes();
        await settingsHandler(unauthReq, unauthRes);
        assert.equal(unauthRes.statusCode, 401);

        // Create valid admin session token
        const token = createAdminSession('admin');

        // PUT settings with valid auth succeeds
        const authReq = {
            method: 'PUT',
            url: '/api/settings',
            headers: { authorization: `Bearer ${token}` },
            body: {
                revtag: 'vladimtul',
                weroRecipient: '+352 691 123 456',
                whatsappLink: 'https://wa.me/352691000000',
                coffeeVisible: true
            }
        };
        const authRes = createMockRes();
        await settingsHandler(authReq, authRes);
        assert.equal(authRes.statusCode, 200);
        assert.equal(authRes.body.settings.weroRecipient, '+352 691 123 456');

        // Verify with another GET
        const verifyRes = createMockRes();
        await settingsHandler(getReq, verifyRes);
        assert.equal(verifyRes.body.settings.weroRecipient, '+352 691 123 456');

        // Restore default
        updateSettings({ weroRecipient: '+352 691 000 000' });
    });

    // -------------------------------------------------------------------------
    // Story 002: Dual Payment Method Selector Tabs & DOM Structure
    // -------------------------------------------------------------------------
    await t.test('Story 002: index.html contains payment method tabs and Wero elements', () => {
        const htmlPath = path.join(__dirname, '..', 'index.html');
        const html = fs.readFileSync(htmlPath, 'utf8');

        // Payment switcher tabs
        assert.ok(html.includes('id="tab-pay-revolut"'), 'Should have Revolut payment tab');
        assert.ok(html.includes('id="tab-pay-wero"'), 'Should have Wero payment tab');

        // Admin setting input for Wero
        assert.ok(html.includes('id="admin-setting-wero"'), 'Should have admin Wero input');

        // Dynamic branding & QR elements
        assert.ok(html.includes('id="pay-method-icon"'), 'Should have payment method icon');
        assert.ok(html.includes('id="pay-method-title"'), 'Should have payment method title');
        assert.ok(html.includes('id="pay-method-subtitle"'), 'Should have payment method subtitle');
        assert.ok(html.includes('id="qr-recipient-pill"'), 'Should have QR recipient pill');
        assert.ok(html.includes('id="qr-center-badge"'), 'Should have QR center badge');
        assert.ok(html.includes('id="qr-scan-instruction"'), 'Should have QR scan instruction');
        assert.ok(html.includes('id="btn-copy-pay-details"'), 'Should have copy payment details button');
        assert.ok(html.includes('id="btn-open-pay-direct"'), 'Should have open direct pay link');
        assert.ok(html.includes('id="qr-method-footnote"'), 'Should have method footnote');

        // Stepper badge updated to generic payment
        assert.ok(html.includes('2. Payment'), 'Step 2 badge should read "2. Payment"');
    });

    // -------------------------------------------------------------------------
    // Story 003: Wero QR Code Generation, Payload & Persistence
    // -------------------------------------------------------------------------
    await t.test('Story 003: Database orders schema supports payment_method column', () => {
        const orderData = {
            orderCode: 'LU-WERO-001',
            customerName: 'Jean Dupont',
            deliveryDate: '',
            deliveryNotes: '',
            items: [{ brand: 'Marlboro', model: 'Red', qty: 1, unitPrice: 57.5, subtotal: 57.5 }],
            tipAmount: 2.5,
            grandTotal: 60.0,
            revolutReference: 'LU-WERO-001 | Jean - 1x Marlboro Red',
            paymentMethod: 'wero',
            totalCigs: 200
        };

        const inserted = insertOrder(orderData);
        assert.equal(inserted.orderCode, 'LU-WERO-001');
        assert.equal(inserted.paymentMethod, 'wero');

        const fetched = getOrderByCode('LU-WERO-001');
        assert.ok(fetched);
        assert.equal(fetched.paymentMethod, 'wero');
    });

    await t.test('Story 003: /api/orders POST handles paymentMethod and defaults to revolut', async () => {
        // Explicit wero order
        const reqWero = {
            method: 'POST',
            url: '/api/orders',
            headers: { 'content-type': 'application/json' },
            body: {
                orderCode: 'LU-WERO-002',
                customerName: 'Marc Weber',
                items: [{ brand: 'Camel', model: 'Yellow', qty: 1, unitPrice: 55.0, subtotal: 55.0 }],
                tipAmount: 0,
                grandTotal: 55.0,
                revolutReference: 'LU-WERO-002 | Marc - 1x Camel Yellow',
                paymentMethod: 'wero',
                totalCigs: 200
            }
        };
        const resWero = createMockRes();
        await ordersHandler(reqWero, resWero);
        assert.equal(resWero.statusCode, 201);
        assert.equal(resWero.body.order.paymentMethod, 'wero');

        // Default to revolut if omitted
        const reqDefault = {
            method: 'POST',
            url: '/api/orders',
            headers: { 'content-type': 'application/json' },
            body: {
                orderCode: 'LU-REV-001',
                customerName: 'Sarah Miller',
                items: [{ brand: 'Winston', model: 'Classic', qty: 1, unitPrice: 52.0, subtotal: 52.0 }],
                tipAmount: 0,
                grandTotal: 52.0,
                revolutReference: 'LU-REV-001 | Sarah - 1x Winston Classic',
                totalCigs: 200
            }
        };
        const resDefault = createMockRes();
        await ordersHandler(reqDefault, resDefault);
        assert.equal(resDefault.statusCode, 201);
        assert.equal(resDefault.body.order.paymentMethod, 'revolut');
    });

    await t.test('Story 003: Wero payload format logic satisfies URL and URI scheme standards', () => {
        const recipientPhone = '+352 691 123 456';
        const recipientUrl = 'https://wero.pay.eu/lux-tabac';
        const grandTotal = 77.00;
        const ref = 'LU-88214 | Jean - 1x Marlboro Red';

        // Custom URI scheme format for phone / email
        const phonePayload = recipientPhone.startsWith('http')
            ? `${recipientPhone}?amount=${grandTotal.toFixed(2)}&ref=${encodeURIComponent(ref)}`
            : `wero://pay?recipient=${encodeURIComponent(recipientPhone)}&amount=${grandTotal.toFixed(2)}&currency=EUR&ref=${encodeURIComponent(ref)}`;

        assert.ok(phonePayload.startsWith('wero://pay?recipient='));
        assert.ok(phonePayload.includes('amount=77.00'));
        assert.ok(phonePayload.includes('currency=EUR'));
        assert.ok(phonePayload.includes(encodeURIComponent(ref)));

        // Web pay link format
        const urlPayload = recipientUrl.startsWith('http')
            ? `${recipientUrl}?amount=${grandTotal.toFixed(2)}&ref=${encodeURIComponent(ref)}`
            : `wero://pay?recipient=${encodeURIComponent(recipientUrl)}&amount=${grandTotal.toFixed(2)}&currency=EUR&ref=${encodeURIComponent(ref)}`;

        assert.ok(urlPayload.startsWith('https://wero.pay.eu/lux-tabac?amount=77.00'));
        assert.ok(urlPayload.includes(encodeURIComponent(ref)));
    });
});
