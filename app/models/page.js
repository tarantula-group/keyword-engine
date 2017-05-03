var bookshelf = require('../bookshelf');
var Keyword = require('./keyword');

var Page = bookshelf.Model.extend({
    tableName: 'pages',
    keywords: function() {
        return this.hasMany(Keyword);
    }
});

module.exports = Page;