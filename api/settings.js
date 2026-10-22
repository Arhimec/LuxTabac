const {
    getAllSettings,
    updateSettings,
    extractBearerToken,
    verifyAdminSession
} = require('./_db.js');

function parseRequestBody(req) {
    if (!req.body) return {};
    if (typeof req.body === 'object') return req.body;
    try {
        return JSON.parse(req.body);
    } catch {
        return {};
    }
}

/**
 * Serverless handler for store settings.
 * GET: Public read of revtag, whatsappLink, coffeeVisible
 * POST/PUT: Admin-only update
 */
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        if (req.method === 'GET') {
            const settings = getAllSettings();
            return res.status(200).json({ success: true, settings, envConfigured: settings.envConfigured });
        }

        if (req.method === 'POST' || req.method === 'PUT') {
            const token = extractBearerToken(req);
            const session = verifyAdminSession(token);
            if (!session) {
                return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
            }

            const body = parseRequestBody(req);
            const updated = updateSettings(body);
            return res.status(200).json({ success: true, settings: updated, envConfigured: updated.envConfigured });
        }

        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    } catch (err) {
        console.error('Settings API Error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
};
