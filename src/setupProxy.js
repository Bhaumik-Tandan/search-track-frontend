const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware([
            '/auth/google/callback',
            '/auth/google',
            '/auth/me',
            '/auth/logout',
            "/search"
        ], {
            target: 'https://search-track.up.railway.app/api/v1',
            changeOrigin: true,
            onProxyRes: function (proxyRes, req, res) {
                // Allow requests from any origin (not recommended for production)
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            },
        })
    );
};
