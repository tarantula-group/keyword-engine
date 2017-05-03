var knex = require("../../config/knex.js");
var Promise = require('bluebird');
var _ = require('lodash');

function deleteAllRecordsFromTable (tableName, clientId) {
    return knex(tableName).where('clientId', clientId).del();
}

module.exports = function(clientId) {
    var tables = [
        'pages',
        'keywords',
        'product_filtered_keywords',
        'business_filtered_keywords',
        'target_keywords'];

    return Promise.all(tables.map(function(tableName) {
        return deleteAllRecordsFromTable(tableName, clientId);
    }))
}