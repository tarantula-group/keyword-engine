var productFilter = require('../services/product-filter');
var winston = require('winston');

exports.applyProductFilter = function (req, res, next) {
    var clientId = req.params.clientId;

    if (!clientId) {
        res.status(400).json({message: 'Include client ID'})
    }

    else {
        productFilter.applyProductFilter(clientId)
            .then(function() {
                winston.info('Saved product filtered keywords');
                res.status(200).json({ message: 'Target keywords correctly generated'})
            })
            .catch(function (err) {
                next(err)
            })
    }
};