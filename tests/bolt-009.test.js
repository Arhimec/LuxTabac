const { test, describe, before, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

process.env.VERCEL = '1';

const {
    getDb,
    getAllSettings,
    updateSettings,
    formatWhatsAppLink,
    createAdminSession
} = require('../api/_db.js');
const settingsHandler = require('../api/settings.js');

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

describe('Bolt 009: Merchant Environment Parameters Tests', () => {
    const originalEnv = { ...process.env };
    const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

    beforeEach(() => {
        // Clear env vars relevant to settings
        delete process.env.REVOLUT_REVTAG;
        delete process.env.REVTAG;
        delete process.env.WHATSAPP_NUMBER;
        delete process.env.WHATSAPP_LINK;
        delete process.env.WERO_RECIPIENT;
        delete process.env.WERO_NUMBER;
    });

    afterEach(() => {
        // Restore original env vars
        delete process.env.REVOLUT_REVTAG;
        delete process.env.REVTAG;
        delete process.env.WHATSAPP_NUMBER;
        delete process.env.WHATSAPP_LINK;
        delete process.env.WERO_RECIPIENT;
        delete process.env.WERO_NUMBER;
        Object.assign(process.env, originalEnv);
    });

    test('1. formatWhatsAppLink helper sanitizes phone numbers and preserves URLs', () => {
        assert.strictEqual(formatWhatsAppLink('+352 691 123 456'), 'https://wa.me/352691123456');
        assert.strictEqual(formatWhatsAppLink('00352 691 888 999'), 'https://wa.me/00352691888999');
        assert.strictEqual(formatWhatsAppLink('https://chat.whatsapp.com/InviteCode123'), 'https://chat.whatsapp.com/InviteCode123');
        assert.strictEqual(formatWhatsAppLink('http://wa.me/352691000000'), 'http://wa.me/352691000000');
        assert.strictEqual(formatWhatsAppLink(''), 'https://wa.me/');
        assert.strictEqual(formatWhatsAppLink(null), 'https://wa.me/');
    });

    test('2. getAllSettings falls back to SQLite and defaults when env vars are absent', () => {
        const settings = getAllSettings();
        assert.ok(settings.revtag, 'Must have a revtag');
        assert.ok(settings.whatsappLink, 'Must have a whatsapp link');
        assert.ok(settings.weroRecipient, 'Must have a wero recipient');
        assert.strictEqual(settings.envConfigured.revtag, false);
        assert.strictEqual(settings.envConfigured.whatsapp, false);
        assert.strictEqual(settings.envConfigured.wero, false);
    });

    test('3. REVOLUT_REVTAG environment parameter takes precedence over SQLite', () => {
        process.env.REVOLUT_REVTAG = 'official_lux';
        const settings = getAllSettings();
        assert.strictEqual(settings.revtag, 'official_lux');
        assert.strictEqual(settings.envConfigured.revtag, true);

        // Test stripping of leading @
        process.env.REVOLUT_REVTAG = '@leading_at_tag';
        const settingsAt = getAllSettings();
        assert.strictEqual(settingsAt.revtag, 'leading_at_tag');
        assert.strictEqual(settingsAt.envConfigured.revtag, true);
    });

    test('4. WHATSAPP_NUMBER environment parameter sanitizes and overrides SQLite', () => {
        process.env.WHATSAPP_NUMBER = '+352 691 777 888';
        const settings = getAllSettings();
        assert.strictEqual(settings.whatsappLink, 'https://wa.me/352691777888');
        assert.strictEqual(settings.envConfigured.whatsapp, true);
    });

    test('5. WERO_RECIPIENT environment parameter takes precedence over SQLite', () => {
        process.env.WERO_RECIPIENT = 'wero.merchant@luxtabac.lu';
        const settings = getAllSettings();
        assert.strictEqual(settings.weroRecipient, 'wero.merchant@luxtabac.lu');
        assert.strictEqual(settings.envConfigured.wero, true);
    });

    test('6. /api/settings GET and PUT endpoints return envConfigured metadata', async () => {
        process.env.REVOLUT_REVTAG = 'env_admin_rev';
        process.env.WHATSAPP_NUMBER = '+352 691 555 666';

        // GET endpoint test
        const getReq = { method: 'GET', url: '/api/settings', headers: {} };
        const getRes = createMockRes();
        await settingsHandler(getReq, getRes);

        assert.strictEqual(getRes.statusCode, 200);
        assert.ok(getRes.body.success);
        assert.strictEqual(getRes.body.settings.revtag, 'env_admin_rev');
        assert.strictEqual(getRes.body.settings.whatsappLink, 'https://wa.me/352691555666');
        assert.strictEqual(getRes.body.envConfigured.revtag, true);
        assert.strictEqual(getRes.body.envConfigured.whatsapp, true);

        // Authenticated PUT endpoint test
        const adminToken = createAdminSession('admin');
        const putReq = {
            method: 'PUT',
            url: '/api/settings',
            headers: { authorization: `Bearer ${adminToken}` },
            body: { weroRecipient: '+352 691 111 222' }
        };
        const putRes = createMockRes();
        await settingsHandler(putReq, putRes);

        assert.strictEqual(putRes.statusCode, 200);
        assert.ok(putRes.body.success);
        assert.strictEqual(putRes.body.envConfigured.revtag, true);
    });

    test('7. index.html contains GitHub Env badge elements in admin settings panel', () => {
        assert.ok(htmlContent.includes('id="env-badge-revtag"'), 'env-badge-revtag must exist in DOM');
        assert.ok(htmlContent.includes('id="env-badge-whatsapp"'), 'env-badge-whatsapp must exist in DOM');
        assert.ok(htmlContent.includes('id="env-badge-wero"'), 'env-badge-wero must exist in DOM');
        assert.ok(htmlContent.includes('GitHub Env'), 'Badges must display GitHub Env text');
    });

    test('8. Root .env.example exists and documents all supported environment parameters', () => {
        const envExamplePath = path.join(__dirname, '../.env.example');
        assert.ok(fs.existsSync(envExamplePath), '.env.example must exist in project root');
        const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
        assert.ok(exampleContent.includes('REVOLUT_REVTAG'), 'Must document REVOLUT_REVTAG');
        assert.ok(exampleContent.includes('WHATSAPP_NUMBER'), 'Must document WHATSAPP_NUMBER');
        assert.ok(exampleContent.includes('WERO_RECIPIENT'), 'Must document WERO_RECIPIENT');
        assert.ok(exampleContent.includes('ADMIN_USER'), 'Must document ADMIN_USER');
        assert.ok(exampleContent.includes('ADMIN_PASSWORD'), 'Must document ADMIN_PASSWORD');
    });
});
