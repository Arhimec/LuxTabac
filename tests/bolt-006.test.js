const { test, describe, before, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Test database setup: use temporary db in /tmp for isolation
process.env.VERCEL = '1';
const {
    getDb,
    insertOrder,
    getWeekStartMonday,
    getNextMonday,
    getWeeklyCigaretteTotal,
    getQuotaStatus
} = require('../api/_db.js');
const quotaHandler = require('../api/quota.js');
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
            this.headers[k] = v;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        },
        end(data) {
            this.body = data;
            return this;
        }
    };
}

describe('Bolt 006: Weekly Quota Governance Tests', () => {
    let db;

    before(() => {
        db = getDb();
    });

    beforeEach(() => {
        // Clear orders table before each test
        db.exec('DELETE FROM orders;');
    });

    test('1. Calendar Monday Calculation Logic (Story 001)', () => {
        // Test Wednesday: 2026-10-21 -> Monday should be 2026-10-19
        const wednesday = new Date('2026-10-21T12:00:00');
        const mondayFromWed = getWeekStartMonday(wednesday);
        assert.strictEqual(mondayFromWed.getDay(), 1, 'Should be Monday (day 1)');
        assert.strictEqual(mondayFromWed.getDate(), 19, 'Should be 19th of October');
        assert.strictEqual(mondayFromWed.getHours(), 0);
        assert.strictEqual(mondayFromWed.getMinutes(), 0);

        // Test Sunday: 2026-10-25 -> Monday should still be 2026-10-19
        const sunday = new Date('2026-10-25T12:00:00');
        const mondayFromSun = getWeekStartMonday(sunday);
        assert.strictEqual(mondayFromSun.getDay(), 1, 'Should be Monday (day 1)');
        assert.strictEqual(mondayFromSun.getDate(), 19, 'Should be 19th of October');

        // Test Monday: 2026-10-19 -> Monday should be 2026-10-19
        const monday = new Date('2026-10-19T12:00:00');
        const mondayFromMon = getWeekStartMonday(monday);
        assert.strictEqual(mondayFromMon.getDay(), 1);
        assert.strictEqual(mondayFromMon.getDate(), 19);

        // Test Next Monday: should be 7 days later
        const nextMonday = getNextMonday(wednesday);
        assert.strictEqual(nextMonday.getDay(), 1);
        assert.strictEqual(nextMonday.getDate(), 26);
    });

    test('2. SQLite Quota Aggregation & getQuotaStatus (Story 001)', () => {
        // Initial state: empty db
        const initialStatus = getQuotaStatus();
        assert.strictEqual(initialStatus.weeklyLimit, 800);
        assert.strictEqual(initialStatus.currentUsed, 0);
        assert.strictEqual(initialStatus.remaining, 800);
        assert.strictEqual(initialStatus.isFull, false);

        // Insert order with 200 cigarettes
        insertOrder({
            orderCode: 'LU-QUOTA-1',
            customerName: 'Jean Dupont',
            items: [{ brand: 'Marlboro', model: 'Red', format: 'carton', quantity: 1, cigs: 200 }],
            grandTotal: 77.00,
            totalCigs: 200
        });

        // Insert second order with 400 cigarettes
        insertOrder({
            orderCode: 'LU-QUOTA-2',
            customerName: 'Marie Schmit',
            items: [{ brand: 'Camel', model: 'Yellow', format: 'carton', quantity: 2, cigs: 400 }],
            grandTotal: 154.00,
            totalCigs: 400
        });

        const updatedStatus = getQuotaStatus();
        assert.strictEqual(updatedStatus.weeklyLimit, 800);
        assert.strictEqual(updatedStatus.currentUsed, 600);
        assert.strictEqual(updatedStatus.remaining, 200);
        assert.strictEqual(updatedStatus.isFull, false);
    });

    test('3. /api/quota Serverless Handler (Story 001)', async () => {
        insertOrder({
            orderCode: 'LU-QUOTA-API',
            customerName: 'Paul Weber',
            items: [{ brand: 'Lucky Strike', model: 'Red', format: 'carton', quantity: 1, cigs: 200 }],
            grandTotal: 75.00,
            totalCigs: 200
        });

        const req = { method: 'GET', url: '/api/quota', headers: {} };
        const res = createMockRes();

        await quotaHandler(req, res);

        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body.success, true);
        assert.strictEqual(res.body.weeklyLimit, 800);
        assert.strictEqual(res.body.currentUsed, 200);
        assert.strictEqual(res.body.remaining, 600);
        assert.strictEqual(res.body.isFull, false);
        assert.ok(res.body.resetTimestamp, 'Should provide resetTimestamp');

        // Test 405 Method Not Allowed
        const postReq = { method: 'POST', url: '/api/quota', headers: {} };
        const postRes = createMockRes();
        await quotaHandler(postReq, postRes);
        assert.strictEqual(postRes.statusCode, 405);
    });

    test('4. POST /api/orders rejects orders exceeding 800-cig weekly limit (Story 001)', async () => {
        // Book 600 cigarettes first
        insertOrder({
            orderCode: 'LU-BASE-600',
            customerName: 'Alice Base',
            items: [{ brand: 'Camel', model: 'Yellow', format: 'carton', quantity: 3, cigs: 600 }],
            grandTotal: 220.00,
            totalCigs: 600
        });

        // Attempt to book 400 more cigarettes (total 1000 > 800)
        const reqExceed = {
            method: 'POST',
            url: '/api/orders',
            headers: {},
            body: {
                orderCode: 'LU-EXCEED-TEST',
                customerName: 'Bob Exceeder',
                items: [{ brand: 'Marlboro', model: 'Gold', format: 'carton', quantity: 2, cigs: 400 }],
                grandTotal: 154.00,
                totalCigs: 400
            }
        };
        const resExceed = createMockRes();

        await ordersHandler(reqExceed, resExceed);

        assert.strictEqual(resExceed.statusCode, 400);
        assert.strictEqual(resExceed.body.success, false);
        assert.strictEqual(resExceed.body.error, 'WEEKLY_QUOTA_EXCEEDED');
        assert.strictEqual(resExceed.body.weeklyLimit, 800);
        assert.strictEqual(resExceed.body.currentUsed, 600);
        assert.strictEqual(resExceed.body.available, 200);
        assert.strictEqual(resExceed.body.requested, 400);

        // Attempt to book 200 cigarettes (total 800 == 800): should succeed
        const reqFit = {
            method: 'POST',
            url: '/api/orders',
            headers: {},
            body: {
                orderCode: 'LU-FIT-TEST',
                customerName: 'Charlie Fit',
                items: [{ brand: 'Winston', model: 'Blue', format: 'carton', quantity: 1, cigs: 200 }],
                grandTotal: 72.00,
                totalCigs: 200
            }
        };
        const resFit = createMockRes();

        await ordersHandler(reqFit, resFit);

        assert.strictEqual(resFit.statusCode, 201);
        assert.strictEqual(resFit.body.success, true);
        assert.strictEqual(resFit.body.order.orderCode, 'LU-FIT-TEST');

        // Now total is 800: any further order should be rejected
        const reqAfterFull = {
            method: 'POST',
            url: '/api/orders',
            headers: {},
            body: {
                orderCode: 'LU-REJECT-FULL',
                customerName: 'David Late',
                items: [{ brand: 'Kent', model: 'Blue', format: 'pack', quantity: 1, cigs: 20 }],
                grandTotal: 7.50,
                totalCigs: 20
            }
        };
        const resAfterFull = createMockRes();
        await ordersHandler(reqAfterFull, resAfterFull);

        assert.strictEqual(resAfterFull.statusCode, 400);
        assert.strictEqual(resAfterFull.body.error, 'WEEKLY_QUOTA_EXCEEDED');
        assert.strictEqual(resAfterFull.body.available, 0);
    });

    test('5. Frontend Weekly Quota Meter & Modal DOM Elements (Story 002)', () => {
        const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

        // Verify weekly quota capacity meter elements
        assert.ok(html.includes('id="weekly-quota-container"'), 'weekly-quota-container element exists');
        assert.ok(html.includes('id="quota-used-cigs"'), 'quota-used-cigs element exists');
        assert.ok(html.includes('id="quota-remaining-cigs"'), 'quota-remaining-cigs element exists');
        assert.ok(html.includes('id="quota-progress-bar"'), 'quota-progress-bar element exists');
        assert.ok(html.includes('id="quota-capacity-badge"'), 'quota-capacity-badge element exists');
        assert.ok(html.includes('id="quota-inline-alert"'), 'quota-inline-alert element exists');
        assert.ok(html.includes('id="alert-quota-remaining"'), 'alert-quota-remaining element exists');

        // Verify blocking modal elements
        assert.ok(html.includes('id="quota-exceeded-modal"'), 'quota-exceeded-modal exists');
        assert.ok(html.includes('id="modal-quota-booked"'), 'modal-quota-booked exists');
        assert.ok(html.includes('id="modal-quota-available"'), 'modal-quota-available exists');
        assert.ok(html.includes('id="modal-quota-requested"'), 'modal-quota-requested exists');
        assert.ok(html.includes('id="modal-quota-reset"'), 'modal-quota-reset exists');
        assert.ok(html.includes('id="btn-close-quota-modal"'), 'btn-close-quota-modal exists');

        // Verify JavaScript functions
        assert.ok(html.includes('function updateWeeklyQuotaUI('), 'updateWeeklyQuotaUI function exists');
        assert.ok(html.includes('function showQuotaExceededModal('), 'showQuotaExceededModal function exists');
        assert.ok(html.includes('function closeQuotaExceededModal('), 'closeQuotaExceededModal function exists');
        assert.ok(html.includes('function fetchQuotaStatus('), 'fetchQuotaStatus function exists');
        assert.ok(html.includes('fetchQuotaStatus()'), 'fetchQuotaStatus called during init');
        assert.ok(html.includes('WEEKLY_QUOTA_EXCEEDED'), 'Client handles WEEKLY_QUOTA_EXCEEDED error code');
    });
});
