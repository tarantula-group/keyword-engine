var winston = require('winston');

module.exports = function requestLogger(req, res, next) {
    winston.info("http_request_received", {
        code: "http_request_received",
        body: req.body,
        url: req.originalUrl,
        protocol: req.protocol,
        params: req.params,
        method: req.method,
        ip: req.ip
    });
    next();
};
