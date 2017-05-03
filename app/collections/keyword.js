var bookshelf = require('../bookshelf');
var keyword = require('../models/keyword');

exports.collections = bookshelf.Collection.extend({
    model: keyword
});