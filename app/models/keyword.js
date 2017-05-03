var bookshelf = require('../bookshelf');

var Keyword = bookshelf.Model.extend({
    tableName: 'keywords',
});


module.exports = Keyword;