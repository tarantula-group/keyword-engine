//Dependencies
var google = require('googleapis');
var webmasters = google.webmasters('v3');
var auth = require('./oauth');
var knex = require('../../config/knex');
var timeUtils = require('../utils/time_formatter');
var winston = require('winston');
var errors = require('../errors');


//Methods

exports.getDomainByClientId = function (clientId) {
    return knex.select('siteName').from('clients').where('id', '=', clientId).then(function (res) {
        if (res.length < 1 || !res[0].siteName) {
            throw errors.httpError('Domain not found for client ID provided')
        }
        return res[0].siteName;
    })
};

exports.getPagePathByPageId = function (pageId) {
    return knex.select('pagePath').from('pages').where('id', '=', pageId)
        .then(function (res) {
            if (res.length < 1) {
                throw errors.httpError('Page ID not found')
            }
            return res[0].pagePath;
        })
};

exports.getFilter = function (dimension, operator, expression) {
    return {
        dimension: dimension,
        operator: operator,
        expression: expression
    }
};

exports.fetch = function (domain, options) {
    options = Object.assign({
        rows: 5000,
        dimensions: ['page'],
        startDate: timeUtils.getPastXDays(90).startDate,
        endDate: timeUtils.getPastXDays(90).endDate,
        startRow: 0
    }, options);

    return new Promise(function (resolve, reject) {
        webmasters.searchanalytics.query(
            {
                'access_token': auth.oauth2Client,
                'siteUrl': domain,
                'fields': 'responseAggregationType,rows',
                'resource': {
                    'startDate': options.startDate,
                    'endDate': options.endDate,
                    'dimensions': options.dimensions,
                    'dimensionFilterGroups': [
                        {'filters': options.filters}
                    ],
                    'startRow': options.startRow,
                    'rowLimit': 5000
                }
            }, function (err, resp) {
                if (err) {
                    reject(err);
                    winston.error('Error gathering keywords for site ' + domain, {
                        response: resp,
                        error: err,
                        options: options
                    });
                } else {
                    resolve(resp);
                    winston.info('Gathered keywords for site ' + domain, 'page path:', options.filters[0].expression);
                }
            });
    });
};
