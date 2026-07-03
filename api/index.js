const app = require('../server/server');

module.exports = (req, res) => {
    const routePath =
    req.query && req.query.path;

    if (routePath) {
        const pathValue =
        Array.isArray(routePath) ? routePath.join('/') : routePath;

        const params =
        new URLSearchParams();

        Object.entries(req.query || {}).forEach(([key, value]) => {
            if (key === 'path') {
                return;
            }

            if (Array.isArray(value)) {
                value.forEach((item) => params.append(key, item));
                return;
            }

            if (value !== undefined) {
                params.append(key, value);
            }
        });

        const queryString =
        params.toString();

        req.url =
        `/api/${pathValue}${queryString ? `?${queryString}` : ''}`;
    }

    return app(req, res);
};
