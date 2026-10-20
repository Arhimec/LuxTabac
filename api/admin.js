const {
    validateAdminCredentials,
    createAdminSession,
    verifyAdminSession,
    deleteAdminSession,
    extractBearerToken
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
 * Serverless handler for Admin authentication and session management.
 * Routes:
 *   POST /api/admin/login   { username, password }
 *   GET  /api/admin/session (Bearer token)
 *   POST /api/admin/logout  (Bearer token)
 */
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    const action = url.searchParams.get('action');

    try {
        // 1. Session verification: GET /api/admin/session or GET /api/admin?action=session
        if (req.method === 'GET' && (pathname.endsWith('/session') || action === 'session')) {
            const token = extractBearerToken(req) || url.searchParams.get('token');
            const session = verifyAdminSession(token);
            if (!session) {
                return res.status(401).json({ success: false, authenticated: false, error: 'Unauthorized: Invalid or expired admin session' });
            }
            return res.status(200).json({ success: true, authenticated: true, username: session.username });
        }

        // 2. Login: POST /api/admin/login or POST /api/admin?action=login
        if (req.method === 'POST' && (pathname.endsWith('/login') || action === 'login' || (!action && !pathname.endsWith('/logout')))) {
            const body = parseRequestBody(req);
            const username = String(body.username || '').trim();
            const password = String(body.password || '').trim();

            if (!username || !password) {
                return res.status(400).json({ success: false, error: 'Username and password are required' });
            }

            if (!validateAdminCredentials(username, password)) {
                return res.status(401).json({ success: false, error: 'Invalid username or password' });
            }

            const token = createAdminSession(username);
            return res.status(200).json({
                success: true,
                token,
                username,
                message: 'Admin authentication successful'
            });
        }

        // 3. Logout: POST /api/admin/logout or POST /api/admin?action=logout
        if (req.method === 'POST' && (pathname.endsWith('/logout') || action === 'logout')) {
            const body = parseRequestBody(req);
            const token = extractBearerToken(req) || body.token;
            if (token) {
                deleteAdminSession(token);
            }
            return res.status(200).json({ success: true, message: 'Logged out successfully' });
        }

        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    } catch (err) {
        console.error('Admin Auth Error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
};
