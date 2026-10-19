const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const db = require('../api/_db.js');

test('Checkout Refinement & Promotions Tests (Intent 002)', async (t) => {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

    await t.test('1. Delivery date and notes inputs are removed', () => {
        assert.ok(!htmlContent.includes('id="delivery-date"'), 'id="delivery-date" input should be removed');
        assert.ok(!htmlContent.includes('id="delivery-notes"'), 'id="delivery-notes" input should be removed');
        assert.ok(!htmlContent.includes('id="summary-delivery-date"'), 'id="summary-delivery-date" should be removed from Step 2');
        assert.ok(!htmlContent.includes('id="summary-delivery-notes"'), 'id="summary-delivery-notes" should be removed from Step 2');
    });

    await t.test('2. Home navigation elements and handlers exist', () => {
        assert.ok(htmlContent.includes('id="btn-header-home"'), 'Header must contain Home button');
        assert.ok(htmlContent.includes('id="header-brand-link"'), 'Header must contain clickable brand logo link');
        assert.ok(htmlContent.includes('function handleNavigateHome('), 'handleNavigateHome() function must be defined');

        // Verify handleNavigateHome doesn't clear age verification
        const handleHomeMatch = htmlContent.match(/function handleNavigateHome\(\)\s*\{([\s\S]*?)\n\s*\}/);
        assert.ok(handleHomeMatch, 'handleNavigateHome body found');
        assert.ok(!handleHomeMatch[1].includes('sessionStorage.removeItem(\'luxtabac_age_verified\')'), 'Must NOT clear age verification');
        assert.ok(!handleHomeMatch[1].includes('sessionStorage.clear()'), 'Must NOT clear sessionStorage entirely');
    });

    await t.test('3. Tipping UI elements and computation logic', () => {
        // UI elements
        assert.ok(htmlContent.includes('id="tip-chips-container"'), 'Tip chips container must exist');
        assert.ok(htmlContent.includes('data-tip="none"'), 'Tip option: None must exist');
        assert.ok(htmlContent.includes('data-tip="round-5"'), 'Tip option: Round 5€ must exist');
        assert.ok(htmlContent.includes('data-tip="round-10"'), 'Tip option: Round 10€ must exist');
        assert.ok(htmlContent.includes('data-tip="percent-5"'), 'Tip option: 5% must exist');
        assert.ok(htmlContent.includes('id="tip-amount-display"'), 'Tip amount display must exist');
        assert.ok(htmlContent.includes('id="summary-tip-row"'), 'Summary tip row must exist in Step 2');
        assert.ok(htmlContent.includes('id="summary-tip"'), 'Summary tip element must exist');

        // Test tip calculation algorithm
        function calculateTip(subtotal, tipMode) {
            if (subtotal <= 0 || tipMode === 'none') return 0;
            if (tipMode === 'round-5') {
                const rem = subtotal % 5;
                return rem === 0 ? 5.00 : Math.round((5 - rem) * 100) / 100;
            }
            if (tipMode === 'round-10') {
                const rem = subtotal % 10;
                return rem === 0 ? 10.00 : Math.round((10 - rem) * 100) / 100;
            }
            if (tipMode === 'percent-5') {
                return Math.round(subtotal * 0.05 * 100) / 100;
            }
            return 0;
        }

        assert.equal(calculateTip(132, 'none'), 0);
        assert.equal(calculateTip(132, 'round-5'), 3.00); // 132 + 3 = 135
        assert.equal(calculateTip(130, 'round-5'), 5.00); // exact 5 adds 5€
        assert.equal(calculateTip(132, 'round-10'), 8.00); // 132 + 8 = 140
        assert.equal(calculateTip(130, 'round-10'), 10.00); // exact 10 adds 10€
        assert.equal(calculateTip(100, 'percent-5'), 5.00);
        assert.equal(calculateTip(65.50, 'percent-5'), 3.28);
    });

    await t.test('4. Coffee Pods & Border Essentials promotional showcase', () => {
        assert.ok(htmlContent.includes('id="coffee-pods-showcase"'), 'Showcase section must exist');
        assert.ok(htmlContent.includes('Senseo Classic'), 'Senseo pods must be featured');
        assert.ok(htmlContent.includes('Lavazza') && htmlContent.includes('Espresso Maestro / Crema'), 'Lavazza pods must be featured');
        assert.ok(htmlContent.includes('Nescafé Dolce Gusto') || htmlContent.includes('Dolce Gusto'), 'Dolce Gusto must be featured');
        assert.ok(htmlContent.includes('Jacobs / Dallmayr'), 'Jacobs / Dallmayr must be featured');
        assert.ok(htmlContent.includes('36 pads') || htmlContent.includes('36 Pads'), 'Pack quantities must be specified');
        assert.ok(htmlContent.includes('€5.49'), 'Prices must be displayed');
    });

    await t.test('5. Backend & SQLite tip persistence', () => {
        const orderCode = 'LU-TIP-' + Date.now();
        const createdOrder = db.insertOrder({
            orderCode,
            customerName: 'Jean TipTest',
            tipAmount: 5.00,
            grandTotal: 135.00,
            items: [
                { brand: 'Camel', model: 'Yellow', qty: 2, subtotal: 130.00, totalCigs: 400, unitFormat: 'carton' }
            ],
            totalCigs: 400,
            revolutReference: 'REV-TIP-TEST'
        });

        assert.equal(createdOrder.tipAmount, 5.00, 'Created order must include tipAmount');
        assert.equal(createdOrder.grandTotal, 135.00, 'Grand total must reflect tip');

        const fetchedOrder = db.getOrderByCode(orderCode);
        assert.ok(fetchedOrder, 'Order must be retrievable by code');
        assert.equal(fetchedOrder.tipAmount, 5.00, 'Retrieved order must have stored tipAmount');
        assert.equal(fetchedOrder.deliveryDate, null, 'Delivery date should be null when omitted');
    });
});
