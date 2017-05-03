let Promise = require('bluebird');
let searchConsole = require('../lib/search-console');
let Pages = require('../collections/pages');
let winston = require('winston');
let errors = require('../errors');

exports.saveAllKeySets = function (req, res, next) {
    let clientId = req.params.clientId;
    let pagesProcessed;
    Pages.collections.forge({clientId: clientId})
        .fetch()
        .then(function (pages) {

            if (pages.length < 1) {
                res.status(200).json({message: "No pages associated with this client ID"})
            }

            else {

                pagesProcessed = pages.toJSON();
                let promisesList = [];
                for (let i = 0; i < pages.length; i += 5) {

                    let pagesBatch = pages.toJSON().slice(i, i + 5);

                    pagesBatch.forEach(function (page) {
                        promisesList.push(
                            Promise.delay(i * 1500).then(function () {
                                return searchConsole.saveKeywordsByPage(page.id, clientId)
                            })
                        );
                    });
                }

                return Promise.all(promisesList.map((promise) => {
                    return promise.reflect();
                }))
                    .then((result) => {

                        let rejectedPromises = [];

                        result.forEach((promise, index) => {
                            if (!promise.isFulfilled()) {
                                rejectedPromises.push(pagesProcessed[index].pagePath)
                            }

                        });

                        if (rejectedPromises.length < 1) {
                            winston.info("Keywords correctly saved");
                            res.status(200).json({message: "Keywords correctly saved"})
                        }

                        else {
                            winston.info(`Keywords saved, ${rejectedPromises.length} pages couldn't be saved. Pages with errors: `, rejectedPromises);
                            res.status(200).json({message: `Keywords saved, ${rejectedPromises.length} pages couldn't be saved`, failedPages: rejectedPromises })
                        }
                    })
            }
        })
        .catch(function (err) {
            winston.error(`Keyword couldn't be saved ${err.originalError}`);
            next(err)
        })
};