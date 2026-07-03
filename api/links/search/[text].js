const handleAs = require('../../../server/vercelHandler');

module.exports = (req, res) => {
    const text =
    req.query && req.query.text;

    if (!text) {
        return res.status(400).json({
            message: 'Search text required'
        });
    }

    req.url =
    `/api/links/search/${encodeURIComponent(text)}`;

    return handleAs(req.url)(req, res);
};
