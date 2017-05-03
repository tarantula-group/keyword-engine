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

    var dbActions = [];

    dbActions.push(db.createTable('clients', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        name: {type: 'string'},
        siteName: {type: 'string'},
        viewId: {type: 'string'},
        mainDomain: {type: 'string'},
        searchDomain: {type: 'string'},
        searchUrlPrefix: {type: 'string'},
        searchUrlSuffix: {type: 'string'},
        strategy: {type: 'string'},
        separator: {type: 'string'},
    }));

    dbActions.push(db.createTable('keywords', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        keyword: {type: 'string'},
        clicks: {type: 'int'},
        impressions: {type: 'int'},
        ctr: {type: 'decimal'},
        position: {type: 'decimal'},
        pageId: {type: 'int'},
        keywordValue: {type: 'decimal'},
        clientId: {type: 'string'},
    }));

    dbActions.push(db.createTable('negative_keywords', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        keyword: {type: 'string'},
        clientId: {type: 'string'},
    }));

    dbActions.push(db.createTable('pages', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        pagePath: {type: 'string'},
        pageValue: {type: 'decimal'},
        sessions: {type: 'int'},
        clientId: {type: 'int'},
    }));

    dbActions.push(db.createTable('products', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        description: {type: 'text'},
        name: {type: 'string'},
        clientId: {type: 'int'},
    }));


    dbActions.push(db.createTable('stop_keywords', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        keyword: {type: 'string'},
        clientId: {type: 'int'},
    }));

    dbActions.push(db.createTable('tokens', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        tokenLabel: {type: 'string'},
        token: {type: 'string'},
        description: {type: 'string'},
        clientId: {type: 'int'},
    }));

    dbActions.push(db.createTable('white_keywords', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        keyword: {type: 'string'},
        originalKeywordId: {type: 'int'},
        clientId: {type: 'int'},
    }));

    dbActions.push(db.createTable('product_filtered_keywords', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        keyword: {type: 'string'},
        originalKeywordId: {type: 'int'},
        clientId: {type: 'string'},
    }));

    dbActions.push(db.createTable('target_keywords', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        fromUrl: {type: 'string'},
        toUrl: {type: 'string'},
        originalKeywordId: {type: 'int'},
        clientId: {type: 'int'},
    }));

    dbActions.push(db.createTable('business_filtered_keywords', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        keyword: {type: 'string'},
        originalKeywordId: {type: 'int'},
        clientId: {type: 'int'},
    }));

    return Promise.all(dbActions);

};

exports.down = function (db) {

    return Promise.all([
        db.dropTable('clients'),
        db.dropTable('keywords'),
        db.dropTable('negative_keywords'),
        db.dropTable('pages'),
        db.dropTable('products'),
        db.dropTable('stop_keywords'),
        db.dropTable('tokens'),
        db.dropTable('white_keywords'),
        db.dropTable('product_filtered_keywords'),
        db.dropTable('target_keywords'),
        db.dropTable('business_filtered_keywords')
    ]);
};

exports._meta = {
    "version": 1
};
