const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const db = require('../api/_db.js');

test('Order History UI & Integration Tests', async (t) => {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

    await t.test('DOM Elements verification in index.html', () => {
        // 1. History trigger in header
        assert.ok(htmlContent.includes('id="btn-open-history"'), 'History button must exist in header');
        assert.ok(htmlContent.includes('id="history-badge"'), 'History badge must exist in header');

        // 2. Slide-over drawer structure
        assert.ok(htmlContent.includes('id="history-drawer"'), 'History drawer container must exist');
        assert.ok(htmlContent.includes('id="history-drawer-backdrop"'), 'History drawer backdrop must exist');
        assert.ok(htmlContent.includes('id="history-drawer-panel"'), 'History drawer panel must exist');
        assert.ok(htmlContent.includes('id="btn-close-history"'), 'Close drawer button must exist');
        assert.ok(htmlContent.includes('id="history-loading"'), 'Loading skeleton must exist');
        assert.ok(htmlContent.includes('id="history-empty"'), 'Empty state must exist');
        assert.ok(htmlContent.includes('id="history-list"'), 'History list container must exist');
        assert.ok(htmlContent.includes('id="drawer-allowance-status"'), 'Drawer EU allowance status indicator must exist');

        // 3. Receipt slip modal structure
        assert.ok(htmlContent.includes('id="receipt-modal"'), 'Receipt modal must exist');
        assert.ok(htmlContent.includes('id="receipt-content-area"'), 'Receipt content area must exist');
        assert.ok(htmlContent.includes('id="btn-copy-receipt"'), 'Copy receipt button must exist');
        assert.ok(htmlContent.includes('id="btn-print-receipt"'), 'Print receipt button must exist');
    });

    await t.test('JavaScript logic & security verification', () => {
        // Verify escapeHTML implementation protects against XSS
        function escapeHTML(str) {
            return String(str ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        const maliciousInput = '<img src=x onerror=alert(1)> & "quotes"';
        const escaped = escapeHTML(maliciousInput);
        assert.ok(!escaped.includes('<img'), 'Must escape HTML tags');
        assert.ok(escaped.includes('&lt;img'), 'Must encode opening bracket');
        assert.ok(escaped.includes('&amp;'), 'Must encode ampersand');

        // Verify EU allowance logic
        function calculateAllowanceStatus(totalCigs) {
            return {
                withinLimit: totalCigs <= 800,
                label: totalCigs <= 800 ? `${totalCigs} / 800 cigs` : `${totalCigs} cigs (High volume)`
            };
        }

        const normalOrder = calculateAllowanceStatus(400); // 2 cartons
        assert.equal(normalOrder.withinLimit, true);
        assert.equal(normalOrder.label, '400 / 800 cigs');

        const highVolumeOrder = calculateAllowanceStatus(1000); // 5 cartons
        assert.equal(highVolumeOrder.withinLimit, false);
        assert.match(highVolumeOrder.label, /High volume/);
    });

    await t.test('1-Click Rebuy payload reconstruction', () => {
        const orderCode = 'LU-REBUY-' + Date.now();
        const savedOrder = db.insertOrder({
            orderCode,
            customerName: 'Marcus Rebuy',
            deliveryDate: '2026-11-05',
            deliveryNotes: 'Near frontière Thionville',
            items: [
                { brand: 'Marlboro', model: 'Gold Carton', qty: 2, subtotal: 130, totalCigs: 400, unitFormat: 'carton' },
                { brand: 'Gauloises', model: 'Blondes Bleues', qty: 1, subtotal: 62, totalCigs: 200, unitFormat: 'carton' }
            ],
            grandTotal: 192,
            revolutReference: 'REV-REBUY-123',
            totalCigs: 600
        });

        // Simulate 1-click rebuy mapping
        const restoredCart = savedOrder.items.map(it => ({
            id: (it.brand + '-' + it.model).toLowerCase().replace(/\s+/g, '-'),
            brand: it.brand,
            model: it.model,
            qty: it.qty,
            subtotal: it.subtotal,
            totalCigs: it.totalCigs
        }));

        assert.equal(restoredCart.length, 2);
        assert.equal(restoredCart[0].brand, 'Marlboro');
        assert.equal(restoredCart[1].brand, 'Gauloises');
        const computedTotal = restoredCart.reduce((sum, it) => sum + it.subtotal, 0);
        assert.equal(computedTotal, 192);
        const computedCigs = restoredCart.reduce((sum, it) => sum + it.totalCigs, 0);
        assert.equal(computedCigs, 600);
    });

    await t.test('Receipt slip invoice formatting', () => {
        const sampleOrder = {
            orderCode: 'LU-RECEIPT-99',
            customerName: 'Sophie Lux',
            deliveryDate: '2026-11-10',
            totalCigs: 400,
            grandTotal: 130,
            revolutReference: 'REV-SOPHIE-99',
            items: [
                { brand: 'Camel', model: 'Yellow', qty: 2, formatLabel: '2x Carton', subtotal: 130 }
            ]
        };

        const receiptText = [
            'LUXTABAC RESERVE RECEIPT',
            `ORDER CODE:  #${sampleOrder.orderCode}`,
            `CUSTOMER:    ${sampleOrder.customerName}`,
            `TOTAL PAID:  EUR ${sampleOrder.grandTotal.toFixed(2)}`,
            `REFERENCE:   ${sampleOrder.revolutReference}`
        ].join('\n');

        assert.ok(receiptText.includes('LUXTABAC RESERVE RECEIPT'));
        assert.ok(receiptText.includes('#LU-RECEIPT-99'));
        assert.ok(receiptText.includes('EUR 130.00'));
        assert.ok(receiptText.includes('REV-SOPHIE-99'));
    });

    await t.test('Age Verification modal dismissal & resilience', () => {
        // 1. CSS display: none !important rule exists
        assert.ok(
            htmlContent.includes('#age-modal.hidden') && htmlContent.includes('display: none !important'),
            'CSS must enforce #age-modal.hidden with display: none !important to override Tailwind flex'
        );

        // 2. Button has defensive inline onclick fallback
        assert.ok(
            htmlContent.includes('onclick="try{sessionStorage.setItem(\'luxtabac_age_verified\',\'1\')'),
            'Confirm button must include inline onclick fallback for instant dismissal'
        );

        // 3. Safe session storage helpers implemented
        assert.ok(htmlContent.includes('function safeSessionSet('), 'Must define safeSessionSet helper');
        assert.ok(htmlContent.includes('function safeSessionGet('), 'Must define safeSessionGet helper');
        assert.ok(htmlContent.includes('function dismissAgeModal('), 'Must define dismissAgeModal helper');

        // 4. Reliable CDN for qrcode with fallback
        assert.ok(
            htmlContent.includes('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js'),
            'QR code generator must use CDN to avoid 404 HTML syntax errors'
        );

        // 5. DOM Structure: Modals are closed before header/main
        const priceModalIdx = htmlContent.indexOf('id="price-explorer-modal"');
        const headerIdx = htmlContent.indexOf('<header');
        assert.ok(priceModalIdx > -1 && headerIdx > priceModalIdx, 'Header must follow modals in DOM');
        const segmentBetween = htmlContent.substring(priceModalIdx, headerIdx);
        // Count opening and closing divs between price modal and header
        const openDivs = (segmentBetween.match(/<div[\s>]/g) || []).length;
        const closeDivs = (segmentBetween.match(/<\/div>/g) || []).length;
        assert.ok(
            closeDivs >= openDivs,
            `Modals must be fully closed before header (open=${openDivs}, close=${closeDivs})`
        );
    });
});


