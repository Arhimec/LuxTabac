const {
    getCoffeePromos,
    addCoffeePromo,
    deleteCoffeePromo,
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
 * Serverless handler for coffee promo showcase cards.
 * GET: Public read
 * POST/DELETE: Admin only
 */
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        if (req.method === 'GET') {
            const items = getCoffeePromos();
            return res.status(200).json({ success: true, count: items.length, items });
        }

        // Mutations require admin session
        const token = extractBearerToken(req);
        const session = verifyAdminSession(token);
        if (!session) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
        }

        if (req.method === 'POST') {
            const body = parseRequestBody(req);
            if (!body.brand || !body.title || typeof body.price === 'undefined') {
                return res.status(400).json({ success: false, error: 'Brand, title, and price are required' });
            }

            const item = addCoffeePromo(body);
            return res.status(201).json({ success: true, item });
        }

        if (req.method === 'DELETE') {
            const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const body = parseRequestBody(req);
            const id = url.searchParams.get('id') || body.id;

            if (!id) {
                return res.status(400).json({ success: false, error: 'Item ID is required for deletion' });
            }

            deleteCoffeePromo(id);
            return res.status(200).json({ success: true, deleted: true, message: `Coffee promo #${id} removed` });
        }

        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    } catch (err) {
        console.error('Coffee Promos API Error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
};
