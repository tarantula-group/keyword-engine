let knex = require("../../config/knex.js");
let errors = require('../errors');
let winston = require('winston');
let Promise = require('bluebird');
let _ = require('lodash');
let BUSINESS = require('../bussiness_contants');

// -- Stop words filter

function isStopWord(word, stopWords) {
    return _.includes(stopWords, word)
}

function removeStopWords(keywordObject, stopWords) {
    let keyWordsArray = keywordObject.keyword.split(' ');

    let keywordWithoutStopWords = keyWordsArray.filter((singleWordInKeyword) => {
        return !isStopWord(singleWordInKeyword, stopWords)
    });

    return {
        'keyword': keywordWithoutStopWords,
        'originalKeywordId': keywordObject.originalKeywordId
    }
}

function filterStopWordsInKeywordsList(keywordsList, stopWords) {
    return keywordsList.map((keywordObject) => {
        return removeStopWords(keywordObject, stopWords);
    })
}

// -- Product filter

function doesKeywordExistAsProduct (splitKeywordArray, clientId) {

    let keywordsQuery = '';
    let searchOr = '';

    splitKeywordArray.forEach((singleWordInKeyword) => {
        keywordsQuery += ` ${searchOr} name LIKE '%${singleWordInKeyword}%' OR description LIKE '%${singleWordInKeyword}%'`;
        searchOr = 'OR';
    });

    let databaseQuery = `SELECT * FROM products where clientId = ${clientId} AND (${keywordsQuery})`;

    return knex.raw(databaseQuery)
        .then((databaseSearchResult) => {
            return databaseSearchResult[0].length >= BUSINESS.minSearchResultsFilter
        })
}

function filterKeywordListByProductList(keywordsList, clientId) {

    let searchProductByKeyword = [];

    keywordsList.forEach((keywordObject) => {
        searchProductByKeyword.push(doesKeywordExistAsProduct(keywordObject.keyword, clientId));
    });


    return Promise.all(searchProductByKeyword)
        .then((databaseSearchResult) => {
            return keywordsList.filter((searchResult, index) => {
                return databaseSearchResult[index]
            })
        });
}

function formatFilteredKeywordsForDatabase(productFilteredKeywordsList, clientId) {
    return productFilteredKeywordsList.map((keywordObject) => {
        return {
            'keyword': keywordObject.keyword.join(' '),
            'originalKeywordId': keywordObject.originalKeywordId,
            'clientId': clientId
        }
    });
}

// -- DB Queries

function getStopWords(clientId) {
    return knex.select('keyword').from('stop_keywords').where('clientId', '=', clientId);
}

function getKeywords(clientId) {
    return knex.select('keyword', 'originalKeywordId').from('business_filtered_keywords').where('clientId', '=', clientId);
}

function saveKeywords(keywordsObjects) {
    return knex.transaction(function (trx) {
        knex.insert(keywordsObjects)
            .into('product_filtered_keywords')
            .transacting(trx)
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

// -- Public

exports.applyProductFilter = function (clientId) {
    winston.info('Initializing product filter');

    let stopWords = getStopWords(clientId);
    let keywordsObject = getKeywords(clientId);

    return Promise.join(stopWords, keywordsObject, (stopWords, keywordsObject) => {
        if (stopWords.length === 0) throw Error('No stop words were find in DB');
        if (keywordsObject.length === 0) throw Error('No keywords were find in DB');

        let stopWordsArray = _.map(stopWords, 'keyword');

        let filteredKeywords = filterStopWordsInKeywordsList(keywordsObject, stopWordsArray);

        return filterKeywordListByProductList(filteredKeywords, clientId)
            .then((keywordsFilteredByProducts ) => {
                let result = formatFilteredKeywordsForDatabase(keywordsFilteredByProducts, clientId);

                return saveKeywords(result)
                    .then(() => {
                        winston.info(`${result.length} keywords successfully saved in DB`);
                    })
            })
    })
        .catch((err) => {
            throw errors.httpError('Product filter error', err)
        })
};
