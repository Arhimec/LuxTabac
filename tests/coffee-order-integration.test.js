const { test, describe, before, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

const {
    getDb,
    insertOrder,
    getRecentOrders,
    getOrderByCode,
    getWeeklyCigaretteTotal,
    getCustomItems
} = require('../api/_db.js');
const ordersHandler = require('../api/orders.js');

describe('Coffee Promo Cards & Order Integration Tests', () => {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

    beforeEach(() => {
        const db = getDb();
        db.exec("DELETE FROM orders WHERE order_code LIKE 'TEST-%' OR order_code LIKE 'LU-%';");
    });

    test('1. Static coffee cards in index.html have interactive Add to Order buttons', () => {
        assert.ok(htmlContent.includes('btn-add-coffee-order'), 'index.html must include btn-add-coffee-order class');
        assert.ok(htmlContent.includes('data-brand="Senseo"'), 'Senseo card must have data-brand');
        assert.ok(htmlContent.includes('data-brand="Lavazza"'), 'Lavazza card must have data-brand');
        assert.ok(htmlContent.includes('data-brand="Dolce Gusto"'), 'Dolce Gusto card must have data-brand');
        assert.ok(htmlContent.includes('data-brand="Jacobs / Dallmayr"'), 'Jacobs card must have data-brand');
        assert.ok(htmlContent.includes('Add to Order'), 'Buttons must display Add to Order text');
    });

    test('2. Dynamic loadPublicCoffeePromos renderer attaches Add to Order buttons and bindCoffeeOrderButtons', () => {
        assert.ok(htmlContent.includes('function addCoffeeToBasket'), 'addCoffeeToBasket function must be defined');
        assert.ok(htmlContent.includes('function bindCoffeeOrderButtons'), 'bindCoffeeOrderButtons function must be defined');
        assert.ok(htmlContent.includes('window.addCoffeeToBasket = addCoffeeToBasket'), 'addCoffeeToBasket must be exposed');
        assert.ok(htmlContent.includes('window.bindCoffeeOrderButtons = bindCoffeeOrderButtons'), 'bindCoffeeOrderButtons must be exposed');
        assert.ok(htmlContent.includes('☕ COFFEE'), 'Basket rendering must display coffee badge');
    });

    test('3. Client-side quota check does not block coffee-only orders', () => {
        assert.ok(
            htmlContent.includes('candidateCigs > 0 && (currentQuotaData.remaining <= 0 || candidateCigs > currentQuotaData.remaining)'),
            'Weekly quota check should only apply when candidateCigs > 0'
        );
    });

    test('4. POST /api/orders successfully creates an order containing coffee items', async () => {
        const req = {
            method: 'POST',
            headers: { host: 'localhost' },
            body: {
                orderCode: `TEST-COFFEE-${Date.now()}`,
                customerName: 'Jean-Pierre Coffee Lover',
                grandTotal: 34.40,
                tipAmount: 2.00,
                paymentMethod: 'revolut',
                totalCigs: 0,
                items: [
                    {
                        id: 'coffee_lavazza_crema',
                        brand: 'Lavazza',
                        model: 'Espresso Maestro / Crema',
                        formatLabel: '30 Capsules • Nespresso Compatible',
                        qty: 2,
                        unitPrice: 8.90,
                        subtotal: 17.80,
                        totalCigs: 0,
                        category: 'coffee'
                    },
                    {
                        id: 'coffee_senseo_classic',
                        brand: 'Senseo',
                        model: 'Senseo Classic / Corsé',
                        formatLabel: '36 Pads • Soft Coffee Pads',
                        qty: 1,
                        unitPrice: 5.49,
                        subtotal: 5.49,
                        totalCigs: 0,
                        category: 'coffee'
                    }
                ]
            }
        };

        let responseStatusCode = null;
        let responseJson = null;
        const res = {
            setHeader: () => {},
            status: (code) => {
                responseStatusCode = code;
                return {
                    json: (data) => {
                        responseJson = data;
                        return data;
                    }
                };
            }
        };

        await ordersHandler(req, res);

        assert.strictEqual(responseStatusCode, 201, 'Should return 201 Created');
        assert.ok(responseJson && responseJson.success, 'Response must be success');
        assert.strictEqual(responseJson.order.totalCigs, 0, 'Total cigs for coffee order must be 0');
        assert.strictEqual(responseJson.order.items.length, 2, 'Must have 2 items stored');
        assert.strictEqual(responseJson.order.items[0].category, 'coffee', 'Category must be coffee');
    });

    test('5. Coffee items in order do not trigger custom cigarette auto-persistence', async () => {
        const customBefore = getCustomItems();
        const initialCustomCount = customBefore.length;

        const req = {
            method: 'POST',
            headers: { host: 'localhost' },
            body: {
                orderCode: `TEST-COFFEE-AUTO-${Date.now()}`,
                customerName: 'Coffee Collector',
                grandTotal: 10.90,
                tipAmount: 1.00,
                totalCigs: 0,
                items: [
                    {
                        id: 'coffee_dolce_gusto_test',
                        brand: 'Dolce Gusto',
                        model: 'Intenso Blend',
                        qty: 1,
                        unitPrice: 9.90,
                        subtotal: 9.90,
                        totalCigs: 0,
                        category: 'coffee'
                    }
                ]
            }
        };

        const res = {
            setHeader: () => {},
            status: (code) => ({ json: (d) => d })
        };

        await ordersHandler(req, res);

        const customAfter = getCustomItems();
        assert.strictEqual(customAfter.length, initialCustomCount, 'Coffee item should NOT be added to custom cigarette table');
    });

    test('6. Mixed order with Tobacco + Coffee accurately calculates cigarette quota count', async () => {
        const req = {
            method: 'POST',
            headers: { host: 'localhost' },
            body: {
                orderCode: `TEST-MIXED-${Date.now()}`,
                customerName: 'Mixed Order Buyer',
                grandTotal: 83.90,
                tipAmount: 0,
                items: [
                    {
                        id: 'marlboro-gold',
                        brand: 'Marlboro',
                        model: 'Gold',
                        format: 'carton',
                        quantity: 1,
                        unitPrice: 75.00,
                        subtotal: 75.00,
                        cigs: 200,
                        category: 'tobacco'
                    },
                    {
                        id: 'coffee_lavazza',
                        brand: 'Lavazza',
                        model: 'Espresso Maestro',
                        format: '30 Capsules',
                        quantity: 1,
                        unitPrice: 8.90,
                        subtotal: 8.90,
                        totalCigs: 0,
                        category: 'coffee'
                    }
                ]
            }
        };

        let responseStatusCode = null;
        let responseJson = null;
        const res = {
            setHeader: () => {},
            status: (code) => {
                responseStatusCode = code;
                return {
                    json: (data) => {
                        responseJson = data;
                        return data;
                    }
                };
            }
        };

        await ordersHandler(req, res);

        assert.strictEqual(responseStatusCode, 201, 'Should create mixed order');
        assert.strictEqual(responseJson.order.totalCigs, 200, 'Total cigs must be 200, ignoring coffee');
    });
});
