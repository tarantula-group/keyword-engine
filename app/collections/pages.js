var bookshelf = require('../bookshelf');
var Page = require('../models/page');

exports.collections = bookshelf.Collection.extend({
    model: Page
});