const { getQuotaStatus } = require('./_db.js');

/**
 * Vercel Serverless Function handler for /api/quota
 * Returns current week cigarette quota telemetry and remaining capacity.
 */
module.exports = async function handler(req, res) {
    // Enable CORS for frontend requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        if (req.method === 'GET') {
            const status = getQuotaStatus();
            return res.status(200).json({
                success: true,
                ...status
            });
        }

        return res.status(405).json({
            success: false,
            error: `Method ${req.method} Not Allowed`
        });
    } catch (err) {
        console.error('Error in /api/quota handler:', err);
        return res.status(500).json({
            success: false,
            error: err.message || 'Internal Quota Server Error'
        });
    }
};
