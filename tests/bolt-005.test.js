const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Bolt 005: Tip & Catalog Streamline Tests', async (t) => {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

    await t.test('1. Tip options refactor (Story 001)', () => {
        // UI elements: only 3 chips
        assert.ok(htmlContent.includes('data-tip="none"'), 'Tip option: None must exist');
        assert.ok(htmlContent.includes('data-tip="round-5"'), 'Tip option: Round Up must exist');
        assert.ok(htmlContent.includes('data-tip="percent-5"'), 'Tip option: 5% must exist');
        assert.ok(!htmlContent.includes('data-tip="round-10"'), 'Tip option: Round 10€ must NOT exist');

        // Extract calculateTip function from htmlContent
        const calculateTipMatch = htmlContent.match(/function calculateTip\(subtotal,\s*mode\)\s*\{([\s\S]*?)\n\s*\}\s*function formatDisplayDate/);
        assert.ok(calculateTipMatch, 'calculateTip function found in index.html');
        assert.ok(calculateTipMatch[1].includes('Math.floor(subtotal * 0.05)'), 'Must use Math.floor for 5% tip rounding down to nearest 1 EUR');

        // Test math execution
        const calculateTipFn = new Function('subtotal', 'mode', calculateTipMatch[1]);
        assert.equal(calculateTipFn(0, 'none'), 0);
        assert.equal(calculateTipFn(77, 'round-5'), 3); // 77 + 3 = 80
        assert.equal(calculateTipFn(80, 'round-5'), 5); // 80 + 5 = 85 (exact adds 5)
        assert.equal(calculateTipFn(132, 'round-5'), 3); // 132 + 3 = 135
        assert.equal(calculateTipFn(77, 'percent-5'), 3); // Math.floor(77 * 0.05 = 3.85) = 3
        assert.equal(calculateTipFn(132, 'percent-5'), 6); // Math.floor(132 * 0.05 = 6.60) = 6
        assert.equal(calculateTipFn(80, 'percent-5'), 4); // Math.floor(80 * 0.05 = 4) = 4
        assert.equal(calculateTipFn(19, 'percent-5'), 0); // Math.floor(19 * 0.05 = 0.95) = 0
    });

    await t.test('2. Luxembourg manufactured cigarette catalog expansion (Story 002)', () => {
        // Must contain all requested manufactured brands
        const expectedBrands = [
            'Marlboro',
            'Camel',
            'Lucky Strike',
            'Winston',
            'Gauloises',
            'Chesterfield',
            'Philip Morris',
            'Dunhill',
            'Kent',
            'Vogue',
            'Davidoff',
            'Benson & Hedges',
            'Pall Mall',
            'JPS',
            'Peter Stuyvesant',
            'Fortuna',
            'Ducados',
            'News',
            'Ducal',
            'Elixyr',
            'Che',
            'Austin',
            'West'
        ];

        expectedBrands.forEach(brand => {
            assert.ok(htmlContent.includes(`brand: "${brand}"`), `Catalog must include brand: ${brand}`);
        });

        // Must NOT contain chopped tobacco, volume buckets, or pots
        assert.ok(!htmlContent.includes('Rolling & Tubing Tobacco (Pots / Buckets)'), 'Must remove rolling and pot tobacco category');
        assert.ok(!htmlContent.includes('isPot: true'), 'Must remove isPot items');
        assert.ok(!htmlContent.includes('500g Mega Box'), 'Must not contain mega boxes of chopped tobacco');
        assert.ok(!htmlContent.includes('Volume Tobacco'), 'Must not contain volume chopped tobacco');
    });

    await t.test('3. Buyer name pre-filtering & reorder prompt (Story 003)', () => {
        // Elements in HTML
        assert.ok(htmlContent.includes('id="name-reorder-container"'), 'Name reorder container must exist');
        assert.ok(htmlContent.includes('id="name-lookup-status"'), 'Returning buyer status indicator must exist');
        assert.ok(htmlContent.includes('id="reorder-item-label"'), 'Reorder item label must exist');
        assert.ok(htmlContent.includes('id="btn-apply-reorder"'), 'Apply reorder button must exist');

        // Logic in script
        assert.ok(htmlContent.includes('function checkReturningBuyerName('), 'checkReturningBuyerName function must exist');
        assert.ok(htmlContent.includes('customerNameInput.addEventListener(\'input\', checkReturningBuyerName)'), 'Must listen to input events on customer-name');
        assert.ok(htmlContent.includes('btnApplyReorder.addEventListener(\'click\''), 'Must have click listener on btnApplyReorder');
    });
});
