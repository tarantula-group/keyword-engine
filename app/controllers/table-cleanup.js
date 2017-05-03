var winston = require('winston');
var tableCleanup = require('../services/table-cleanup');


exports.tableCleanup = function (req, res, next) {
    var clientId = req.params.clientId;

    tableCleanup(clientId)
        .then(function () {
                winston.info('Client tables have been cleaned up.');
                res.status(200).json({message: 'Client tables have been cleaned up.'})
        })
        .catch(function (err) {
            next(err)
        })
};