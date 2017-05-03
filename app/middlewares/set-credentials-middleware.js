var oauth = require('../integrations/oauth');
var winston = require('winston');


var setCredentials =  function (req, res, next) {
    var clientId = req.params.clientId;
    oauth.setExistingCredentials(clientId)
        .then(function () {
            winston.info('Client credentials were set');
            next()
        }, function (error) {
            next(error);
        })
};

module.exports = setCredentials;