var winston = require('winston');
var searchConsole = require('../lib/search-console');


exports.saveKeywords = function (req, res, next) {
    var pageId = req.body.pageId;
    var clientId = req.params.clientId;

    searchConsole.saveKeywordsByPage(pageId, clientId, next)
        .then(function (keySetSaved) {
            if (keySetSaved) {
                winston.info('All keywords for page ID ' + pageId + ' have been saved successfully');
                res.status(200).json({message: 'All keywords for page ID ' + pageId + ' have been saved successfully'})
            }

            else {
                winston.info('Page ID ' + pageId + ' has no related keywords');
                res.status(200).json({message: 'Page ID ' + pageId + ' has no related keywords'})
            }
        })
        .catch(function (err) {
            next(err)
        })
};