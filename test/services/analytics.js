"use strict";
var _      = require('lodash');
var assert = require('chai').assert;
var expect = require('chai').expect;
var sinon = require('sinon');
var nock = require('nock');
var mockery = require('mockery');
var analytics = require('../../app/integrations/analytics');
var timeUtils = require('../../app/utils/time_formatter');

describe('Analytics', function () {


    before(function(){
        this.knex = require('../../config/knex');
        this.mockDb = require('mock-knex');
        this.db = this.knex({
            client: 'sqlite'
        });
        this.mockDb.mock(this.db);
        this.tracker = this.mockDb.getTracker();
        this.tracker.install();
    });

    describe('#getViewIdByClientId', function() {

       it('should get from the database the viewId with the given clientId', function() {

           this.tracker.on('query', function checkResult(query) {
               query.response([{viewId : '123'}]);
           });

           analytics.getViewIdByClientId(1).then((viewId) => {
               assert.equal(viewId, '123');
           })
       });

        it('should throw an error if the clientId is not found', function() {

            this.tracker.on('query', function checkResult(query) {
                query.response([]);
            });

            var promise = analytics.getViewIdByClientId(1);
            expect(promise).to.be.rejected;
            promise.catch(function(err) {
                assert.equal(err.message, 'ClientId not found in database');
            })
        });

    });


    describe('#fetch', function() {

        it('should add the correct options to the option object', function() {

            var today = new Date();
            var clock = sinon.useFakeTimers(today.getTime());
            //Now every time 'Date new()' in the tested module is called it will return the today variable.

            var options = {
                startRow: 1,
                dimensions: ['query'],
                filters: {
                    dimension: 'page',
                    operator: 'equals',
                    expression: 'www.example.com/test'
                }
            };

            var expectedFormattedOptions = Object.assign(options, {
                rows: 10000,
                metrics: [{"expression":"ga:pageviews"}],
                dimensions: [{"name":'ga:pagePath'}],
                startDate: timeUtils.formatDate(today.setDate(today.getDate() - 2)),
                endDate: timeUtils.formatDate(today.setDate(today.getDate() - (90 + 2))),
                orderBys: {},
                segments: []
            })

            assert.deepEqual(analytics.formatOptions(options), expectedFormattedOptions);
            clock.restore();

        });

    });

});