var express = require('express');
var Router = express.Router();

// google API

Router.post('/google-api/save-pages/:clientId', require('./../controllers/save-pages-by-value').saveTopValuePages);
Router.post('/google-api/save-keywords/:clientId', require('./../controllers/save-keywords-by-page').saveKeywords);
Router.post('/google-api/save-all-keywords/:clientId', require('./../controllers/get-keywords-all-pages').saveAllKeySets);

// Filters

Router.post('/apply-business-filter/:clientId', require('./../controllers/filter-business').applyBusinessFilter);
Router.post('/apply-product-filter/:clientId', require('./../controllers/apply-product-filter').applyProductFilter);
Router.post('/filter-negative-keywords/:clientId', require('./../controllers/filter-negative-keywords').filterNegativeKeywords);
Router.post('/table-cleanup/:clientId', require('./../controllers/table-cleanup').tableCleanup);

// Widget

Router.get('/widget/:clientId', require('./../controllers/get-widget').getWidget);

exports = module.exports = Router;