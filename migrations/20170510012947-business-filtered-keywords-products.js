'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {

    return db.createTable('business_filtered_keywords_products', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        productId: {type: 'int'},
        originalKeywordId: {type: 'int'},
        clientId: {type: 'int'},
        businessFilteredKeywordId: {type: 'int'}
    });

};

exports.down = function (db) {

    return db.dropTable('business_filtered_keywords_products');
};

exports._meta = {
    "version": 1
};
