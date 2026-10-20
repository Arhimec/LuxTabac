const { insertOrder, getRecentOrders, getOrderByCode, getWeeklyCigaretteTotal } = require('./_db.js');

/**
 * Helper to ensure req.body is parsed as an object.
 */
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
 * Vercel Serverless Function handler for /api/orders
 */
module.exports = async function handler(req, res) {
    // Enable CORS for frontend requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        if (req.method === 'GET') {
            const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const code = url.searchParams.get('code');
            const limit = parseInt(url.searchParams.get('limit') || '50', 10);

            if (code) {
                const order = getOrderByCode(code);
                if (!order) {
                    return res.status(404).json({ success: false, error: 'Order not found' });
                }
                return res.status(200).json({ success: true, order });
            }

            const orders = getRecentOrders(limit);
            return res.status(200).json({
                success: true,
                count: orders.length,
                orders: orders
            });
        }

        if (req.method === 'POST') {
            const body = parseRequestBody(req);

            if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Order must contain at least one item.'
                });
            }

            if (typeof body.grandTotal === 'undefined' || isNaN(Number(body.grandTotal))) {
                return res.status(400).json({
                    success: false,
                    error: 'Valid grandTotal is required.'
                });
            }

            // Calculate candidate order total cigarettes
            const candidateCigs = typeof body.totalCigs !== 'undefined'
                ? Number(body.totalCigs)
                : body.items.reduce((sum, item) => {
                    const itemCigs = typeof item.cigs !== 'undefined'
                        ? Number(item.cigs)
                        : (item.format === 'carton' ? 200 : 20) * (Number(item.quantity) || 1);
                    return sum + itemCigs;
                }, 0);

            // Enforce weekly quota (800 cigarettes per calendar week across all consignments)
            const currentWeeklyUsed = getWeeklyCigaretteTotal();
            if (currentWeeklyUsed + candidateCigs > 800) {
                return res.status(400).json({
                    success: false,
                    error: 'WEEKLY_QUOTA_EXCEEDED',
                    message: 'Weekly Luxembourg courier quota (800 cigarettes) exceeded for this week.',
                    weeklyLimit: 800,
                    currentUsed: currentWeeklyUsed,
                    available: Math.max(0, 800 - currentWeeklyUsed),
                    requested: candidateCigs
                });
            }

            const createdOrder = insertOrder({
                orderCode: body.orderCode,
                customerName: body.customerName,
                deliveryDate: body.deliveryDate,
                deliveryNotes: body.deliveryNotes,
                items: body.items,
                grandTotal: body.grandTotal,
                tipAmount: body.tipAmount,
                revolutReference: body.revolutReference,
                totalCigs: candidateCigs
            });

            return res.status(201).json({
                success: true,
                order: createdOrder
            });
        }

        return res.status(405).json({
            success: false,
            error: `Method ${req.method} Not Allowed`
        });
    } catch (err) {
        console.error('Error in /api/orders handler:', err);
        return res.status(500).json({
            success: false,
            error: err.message || 'Internal Database Server Error'
        });
    }
};
