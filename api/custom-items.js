const {
    getCustomItems,
    addCustomItem,
    updateCustomItemPrice,
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
 * Serverless handler for custom cigarette items entered by buyers.
 * GET: Public read (populates dropdown)
 * POST: Public / Buyer creation (persisted to DB for all buyers)
 * PUT/PATCH: Admin only (price adjustment)
 */
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        if (req.method === 'GET') {
            const items = getCustomItems();
            return res.status(200).json({ success: true, count: items.length, items });
        }

        if (req.method === 'POST') {
            const body = parseRequestBody(req);
            if (!body.brand || !body.model) {
                return res.status(400).json({ success: false, error: 'Brand and Model are required' });
            }

            const item = addCustomItem({
                brand: body.brand,
                model: body.model,
                packPrice: body.packPrice,
                cartonPrice: body.cartonPrice,
                createdBy: body.createdBy || 'Buyer'
            });
            return res.status(201).json({ success: true, item });
        }

        if (req.method === 'PUT' || req.method === 'PATCH') {
            const token = extractBearerToken(req);
            const session = verifyAdminSession(token);
            if (!session) {
                return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
            }

            const body = parseRequestBody(req);
            const id = body.id;
            const packPrice = Number(body.packPrice);
            const cartonPrice = Number(body.cartonPrice);

            if (!id || isNaN(packPrice) || isNaN(cartonPrice)) {
                return res.status(400).json({ success: false, error: 'ID, packPrice, and cartonPrice are required' });
            }

            const updated = updateCustomItemPrice(id, packPrice, cartonPrice);
            if (!updated) {
                return res.status(404).json({ success: false, error: 'Item not found' });
            }
            return res.status(200).json({ success: true, item: updated });
        }

        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    } catch (err) {
        console.error('Custom Items API Error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
};
