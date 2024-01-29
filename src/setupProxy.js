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
            target: 'https://3b5f-2405-201-13-305f-fd4e-21a6-6c6a-e6b.ngrok-free.app/api/v1',
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
