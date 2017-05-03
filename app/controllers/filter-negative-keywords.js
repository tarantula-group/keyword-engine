var filterNegativeKeywords = require('../services/filter-negative-keywords');
var winston = require('winston');

exports.filterNegativeKeywords = function (req, res, next) {
    var clientId = req.params.clientId;

    filterNegativeKeywords.filterNegativeKeywords(clientId)
        .then(function (keySetSaved) {
            if (keySetSaved) {
                winston.info('Target keywords have been generated correctly');
                res.status(200).json({message: 'Target keywords have been generated correctly'})
            }
        })
        .catch(function (err) {
            next(err)
        })
};