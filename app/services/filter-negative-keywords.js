let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let _ = require('lodash');
let proxyConsumption = require('./proxy-consumption');

//Private

function getKeywords(clientId) {
    return knex.select('keyword', 'originalKeywordId').from('product_filtered_keywords').where('clientId', '=', clientId);
}

function getNegativeKeywords(clientId) {
    return knex.select('keyword').from('negative_keywords').where('clientId', '=', clientId);
}

function filterNegativeKeywords(keywords, negativeKeywords) {
    return _.filter(keywords, function (keyword) {
        return !isNegativeKeywords(keyword, negativeKeywords);
    });
}

function isNegativeKeywords(keyword, negativeKeywords) {
    return (_.intersection(keyword.keyword.split(' '), negativeKeywords).length > 0);
}

exports.filterNegativeKeywords = function (clientId) {
    let negativeKeywordsPromise = getNegativeKeywords(clientId);
    let keywordsPromise = getKeywords(clientId);

    return Promise.join(negativeKeywordsPromise, keywordsPromise, (negativeKeywords, keywords) => {

        let negativeKeywordsVector = _.map(negativeKeywords, function (negativeKeyword) {
            return negativeKeyword.keyword;
        });

        let filteredKeywords = filterNegativeKeywords(keywords, negativeKeywordsVector);
        return proxyConsumption.prepareForProxyConsumption(filteredKeywords, clientId)
            .then((targetKeywords) => {
                return knex.transaction(function (trx) {
                    knex.insert(targetKeywords)
                        .into('target_keywords')
                        .transacting(trx)
                        .then(trx.commit)
                        .catch(trx.rollback);
                });
            });
    });
};
