var MockCollection = require('streamhub-sdk-tests/mocks/collection/mock-collection');
var queryBootstrapJson = require('json!streamhub-sdk-tests/fixtures/query-bootstrap.json');
var QueryCollectionArchive = require('streamhub-sdk/collection/streams/archive-query');

function getBootstrapClient(err, data) {
    return {
        getContent: function (opts, errback) {
            if (err) {
                return errback({ statusCode: 404 });
            }
            errback(null, data);
        }
    };
}

describe('QueryCollectionArchive', function () {
    var archive;
    var collection;

    beforeEach(function () {
        collection = new MockCollection();
        collection.articleId = 'article123';
        collection.environment = 'livefyre.com';
        archive = new QueryCollectionArchive({
            collection: collection,
            queries: ['abc', 'def']
        });
    });

    it('creates an instance and has correct properties', function () {
        expect(archive instanceof QueryCollectionArchive).toBe(true);
        expect(archive._queries).toEqual(['abc', 'def']);
    });

    describe('_getBootstrapClientOptions', function () {
        it('generates the correct options', function () {
            expect(archive._getBootstrapClientOptions()).toEqual({
                articleId: 'article123',
                environment: 'livefyre.com',
                network: 'blah',
                page: undefined,
                queryId: 'abc',
                siteId: '123'
            });
        });
    });

    describe('_getPagination', function () {
        it('returns empty if no cursor', function () {
            expect(archive._getPagination()).toEqual({});
        });

        it('returns max if descending', function () {
            archive._cursor = {next: 123};
            archive._isDesc = true;
            expect(archive._getPagination()).toEqual({max: 123});
        });

        it('returns min if ascending', function () {
            archive._cursor = {next: 123};
            archive._isDesc = false;
            expect(archive._getPagination()).toEqual({min: 123});
        });
    });

    describe('_hasMore', function () {
        it('returns false if there are no queries', function () {
            archive._queries = [];
            archive._cursor = {next: '123'};
            expect(archive._hasMore()).toBe(false);

            archive._queries = [];
            archive._cursor = null;
            expect(archive._hasMore()).toBe(false);
        });

        it('returns true if there are queries', function () {
            archive._cursor = {next: '123'};
            expect(archive._hasMore()).toBe(true);

            archive._cursor = null;
            expect(archive._hasMore()).toBe(true);
        });
    });

    describe('_processPagination', function () {
        it('removes a query if no more', function () {
            archive._processPagination({hasMore: false, cursor: {previous: '012', next: '123'}});
            expect(archive._cursor).toBe(null);
            expect(archive._queries).toEqual(['def']);
        });

        it('updates the instance cursor if there are more', function () {
            archive._processPagination({hasMore: true, cursor: {previous: '012', next: '123'}});
            expect(archive._cursor).toEqual({previous: '012', next: '123'});
            expect(archive._queries).toEqual(['abc', 'def']);
        });
    });

    describe('_read', function () {
        it('pushes null to signify no more content if no more content', function () {
            spyOn(archive, 'push');
            archive._queries = [];
            archive._read();
            expect(archive.push).toHaveBeenCalledWith(null);
        });

        it('reads the next page if there is more content', function () {
            spyOn(archive, '_readNextPage');
            archive._read();
            expect(archive._readNextPage).toHaveBeenCalled();
        });
    });

    describe('_readNextPage', function () {
        it('emits an error if the request failed', function () {
            spyOn(archive, 'emit');
            archive._bootstrapClient = getBootstrapClient(true);
            archive._readNextPage();
            expect(archive.emit).toHaveBeenCalled();
        });

        it('emits an error if there is no data', function () {
            spyOn(archive, 'emit');
            archive._bootstrapClient = getBootstrapClient(false, null);
            archive._readNextPage();
            expect(archive.emit).toHaveBeenCalled();
        });

        it('pushes fetched content', function () {
            spyOn(archive, 'push');
            archive._bootstrapClient = getBootstrapClient(false, queryBootstrapJson);
            archive._readNextPage();
            expect(archive.push).toHaveBeenCalled();
            var contents = archive.push.calls[0].args;
            expect(contents.length).toBe(3);
        });

        it('reads again if there is no content on the initial fetch', function () {
            spyOn(archive, '_read');
            archive._bootstrapClient = getBootstrapClient(false, {
                content: [],
                authors: {},
                paging: {}
            });
            archive._readNextPage();
            expect(archive._read.calls.length).toBe(1);
            expect(archive._initial).toBe(false);
        });
    });
});
