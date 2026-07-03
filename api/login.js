const handleAs = require('../server/vercelHandler');

module.exports = (req, res) => {
    if (req.method === 'GET') {
        return res.status(200).json({
            ok: true,
            route: '/api/login',
            accepts: 'POST'
        });
    }

    return handleAs('/api/auth/login')(req, res);
};
