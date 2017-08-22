var QueryBootstrapClient = require('streamhub-sdk/collection/clients/query-bootstrap-client');

describe('QueryBootstrapClient', function () {
    var client;
    var opts = {
        qa: {
            environment: 'qa-ext.livefyre.com',
            network: 'test.fyre.co',
            queryId: 'abc'
        },
        staging: {
            environment: 't402.livefyre.com',
            network: 'test.fyre.co',
            queryId: 'abc'
        },
        production: {
            network: 'test.fyre.co',
            queryId: 'abc'
        }
    };

    beforeEach(function () {
        client = new QueryBootstrapClient();
    });

    describe('_getPath', function () {
        it('works for QA', function () {
            expect(client._getPath(opts.qa)).toEqual('https://data.qa-ext.livefyre.com/bs4/test.fyre.co/query/abc/');
        });

        it('works for UAT', function () {
            expect(client._getPath(opts.staging)).toEqual('https://test.bootstrap.fyre.co/bs4/test.fyre.co/query/abc/');
        });

        it('works for production', function () {
            expect(client._getPath(opts.production)).toEqual('https://test.bootstrap.fyre.co/bs4/test.fyre.co/query/abc/');
        });
    });

    describe('_getQueryObject', function () {
        it('builds the object with max provided', function () {
            expect(client._getQueryObject({max: 456, test: 'xyz'})).toEqual({max: 456});
        });

        it('builds the object with min provided', function () {
            expect(client._getQueryObject({min: 123, test: 'xyz'})).toEqual({min: 123});
        });
    });
});
