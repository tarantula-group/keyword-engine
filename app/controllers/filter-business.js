let businessFilter = require('../services/keywords-value');
let winston = require('winston');

exports.applyBusinessFilter = function (req, res, next) {
    let keywordsAmount = req.body.keywordsAmount;
    let clientId = req.params.clientId;

    if (!clientId || !keywordsAmount) {
        res.status(400).json({message: 'Include client ID and keysets amount'})
    }

    else {
        return businessFilter.saveKeywordsToDb(keywordsAmount, clientId)
            .then(function(result) {
                if (!result) {
                    winston.info("There were no keywords available to save");
                    res.status(200).json({message: "There were no keywords available to save"})
                }
                else {
                    winston.info("Top keywords successfully filtered");
                    res.status(200).json({message: "Top keywords successfully filtered"})
                }
            })
            .catch(function (err) {
                next(err)
            })
    }
};