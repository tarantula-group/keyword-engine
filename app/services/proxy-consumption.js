let knex = require("../../config/knex.js");
let winston = require('winston');
let Promise = require('bluebird');
let _ = require('lodash');
let strategies = require('./strategies');

function getClientData (clientId) {
    return knex
        .select('id', 'mainDomain', 'searchDomain', 'searchUrlPrefix', 'searchUrlSuffix', 'strategy', 'separator')
        .from('clients').where('id','=', clientId);
}
function generateFromUrl(keyword, clientData) {
    switch(clientData.strategy) {
        case 'REPLACE':
            let options = { separator: clientData.separator };
            return strategies.replaceStrategy(keyword, options);
        default:
            return strategies.defaultStrategy(keyword);
    }
}

function generateToUrl(keyword, clientData) {
    return strategies.replaceStrategy(keyword, {
        separator: '-',
        prefix: clientData.searchUrlPrefix,
        suffix: clientData.searchUrlSuffix
    });
}

function generateTargetKeywords(keywords, clientData) {
    return _.map(keywords, function(keyword) {
        return generateTargetKeyword(keyword, clientData)
    });
}

function generateTargetKeyword(keyword, clientData) {
    return {
        fromUrl: generateFromUrl(keyword, clientData),
        toUrl: generateToUrl(keyword, clientData),
        originalKeywordId: keyword.originalKeywordId,
        clientId: clientData.id
    }
}

exports.prepareForProxyConsumption = function prepareForProxyConsumption(keywordsObject, clientId) {
    return getClientData(clientId).then(function(clientData) {
        return generateTargetKeywords(keywordsObject, clientData[0]);
    });
};
