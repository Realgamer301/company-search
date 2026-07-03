const handleAs = require('../../server/vercelHandler');

module.exports = (req, res) => {
    const id =
    req.query && req.query.id;

    if (!id) {
        return res.status(400).json({
            message: 'Invalid link ID'
        });
    }

    req.url =
    `/api/links/${id}`;

    return handleAs(req.url)(req, res);
};
