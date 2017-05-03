var google = require('googleapis');
var analytics = google.analyticsreporting('v4');
var auth = require('./oauth');
var knex = require('../../config/knex');
var timeUtils = require('../utils/time_formatter');
var Promise = require('bluebird');
var winston = require('winston');

exports.getViewIdByClientId = function (clientId) {
    return knex.select('viewId').from('clients').where('id','=', clientId).then(function(res) {
        if (!res) throw new Error;
        return res[0].viewId;
    }).catch(function() {
        throw new Error('ClientId not found in database');
    });
};

function formatOptions(options) {
    return Object.assign({
        rows: 10000,
        metrics: [{"expression":"ga:pageviews"}],
        dimensions: [{"name":'ga:pagePath'}],
        startDate: timeUtils.getPastXDays(90).startDate,
        endDate: timeUtils.getPastXDays(90).endDate,
        orderBys: {},
        segments: []
    }, options);
}

exports.formatOptions = formatOptions;

exports.fetch = function (viewId, options) {

    var formattedOptions = formatOptions(options);

    return new Promise(function(resolve, reject) {
        analytics.reports.batchGet({
            headers: {
                "Content-Type": "application/json"
            },
            auth: auth.oauth2Client,
            "resource": {
                "reportRequests":
                    [
                        {
                            "viewId": viewId,
                            "dateRanges":[
                                {
                                    "startDate": formattedOptions.startDate,
                                    "endDate": formattedOptions.endDate
                                }],
                            "metrics": formattedOptions.metrics,
                            "orderBys": formattedOptions.orderBys,
                            "segments": formattedOptions.segments,
                            "dimensions": formattedOptions.dimensions,
                            "samplingLevel":  "LARGE",
                            "pageSize": formattedOptions.pageSize,
                            "includeEmptyRows": true
                        }]
            }
        }, function (err, resp) {
            if (err) {
                reject(err);
                winston.error('Error gathering analytics pages', {
                    response: resp,
                    error: err,
                    options: formattedOptions
                });
            } else {
                resolve(resp);
                winston.info(resp.reports[0].data.rows.length + ' pages were gathered from Analytics');
            }
        })
    })
};
