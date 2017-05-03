var analytics = require('../integrations/analytics');
var errors = require('../errors');

exports.getPages = function (pageSize, clientId, orderBy) {

    if (!pageSize || !clientId) {
        throw errors.httpError('Include page size and client ID');
    }

    var options = getAnalyticsOptions(pageSize, orderBy);

    return analytics.getViewIdByClientId(clientId)
        .then(function (viewId) {
            return analytics.fetch(viewId, options)
        })
        .catch(function (error) {
            throw errors.httpError("Get pages error", error);
        });
};

function getAnalyticsOptions(pageSize, orderBy) {
    return {
        pageSize: pageSize,
        metrics: [
            {"expression": "ga:pageValue"},
            {"expression": "ga:sessions"}
        ],
        dimensions: [
            {name: 'ga:pagePath'},
            {name: "ga:segment"}
        ],
        orderBys: [
            {
                "sortOrder": "DESCENDING",
                "fieldName": orderBy || "ga:pageValue"
            }
        ],
        segments: [
            {
                "segmentId": "gaid::TRNU4qP8Q6K5L8nPDicJaA"
            }
        ]
    };
}