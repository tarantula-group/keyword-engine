var errors = require('../errors');
var knex = require("../../config/knex.js");

exports.getKeywordsForWidget = function (clientId) {

    return getTargetKeywords(clientId)
        .then((keywords) => {

            let result = keywords.map((keyword) => {
                return {anchorText: keyword.keyword, link: keyword.fromUrl}
            });

            return result;
        })
};

function getTargetKeywords (clientId) {
    return knex.select('keywords.keyword','target_keywords.fromUrl')
        .from('target_keywords').leftJoin('keywords', 'target_keywords.originalKeywordId', 'keywords.id')
        .where('target_keywords.clientId','=', clientId)
        .orderBy(knex.raw('RAND()'))
        .limit(5);
}