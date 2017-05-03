var knex = require("../../config/knex.js");

function getTopKeywords (amount, clientId) {
    return knex.select('keywords.id','keywords.keyword','keywords.keywordValue')
        .from('keywords').leftJoin('pages', 'pages.id', 'keywords.pageId')
        .where('pages.clientId','=', clientId)
        .orderBy('keywordValue', 'desc').limit(amount);
}

function insertFilteredKeywords (businessFilteredKeywords, clientId) {

    var filteredKeywords = [];
    businessFilteredKeywords.forEach(function (row) {
        return filteredKeywords.push({
            originalKeywordId: row.id,
            keyword: row.keyword,
            clientId: clientId,
        });
    });

    return knex.transaction(function(trx) {
        knex.insert(filteredKeywords)
            .into('business_filtered_keywords')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

exports.saveKeywordsToDb = function (amount, clientId) {
    return getTopKeywords(amount, clientId)
        .then(function (topKeywords) {
            if (topKeywords.length < 1) {
                return null;
            }

            return insertFilteredKeywords(topKeywords, clientId);
        })
};