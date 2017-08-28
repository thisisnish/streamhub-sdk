define([
    'streamhub-sdk/collection/streams/archive',
    'streamhub-sdk-tests/mocks/collection/mock-collection',
    'stream/readable',
    'json!streamhub-sdk-tests/fixtures/default-bootstrap.json',
    'json!streamhub-sdk-tests/fixtures/multi-page-bootstrap.json',
    'json!streamhub-sdk-tests/fixtures/single-page-bootstrap.json'],
function (CollectionArchive, MockCollection, Readable, bootstrapResponseJson, multiPageBootstrapJson, singlePageBootstrapJson) {
    'use strict';

    function makeBootstrapClientFactory (numPages, mockInitResponse, mockPageResponse) {
        mockPageResponse = mockPageResponse || bootstrapResponseJson;
        return function factory () {
            return {
                getContent: function (opts, errback) {
                    opts = opts || {};
                    if (opts.page > (numPages-1)) {
                        return errback({ statusCode: 404 });
                    }
                    errback(null, typeof opts.page !== 'undefined' ? mockPageResponse : mockInitResponse);
                },
                mockInitResponse: mockInitResponse,
                mockPageResponse: mockPageResponse
            };
        };
    }

    var multiPageBootstrapClient = makeBootstrapClientFactory(17, multiPageBootstrapJson);
    var singlePageBootstrapClient = makeBootstrapClientFactory(1, singlePageBootstrapJson);

    // Return true if things array is in order based on comparator
    // else false
    function inOrder(things, comparator) {
        var thing;
        var nextThing;
        for (var i=0, numThings=things.length; i < numThings; i++) {
            thing = things[i];
            nextThing = things[i+1];
            if (comparator(thing, nextThing) > 0) {
                return false;
            }
        }
        return true;
    }

    describe('streamhub-sdk/streams/collection-archive', function () {

        describe('when constructed', function () {
            var archive;
            var bootstrapClient;
            beforeEach(function () {
                bootstrapClient = multiPageBootstrapClient();
                archive = new CollectionArchive({
                    collection: new MockCollection(),
                    bootstrapClient: bootstrapClient
                });
            });
            it('is instanceof CollectionArchive', function () {
                expect(archive instanceof CollectionArchive).toBe(true);
            });
            it('is instanceof Readable', function () {
                expect(archive instanceof Readable).toBe(true);
                expect(archive.readable).toBe(true);
            });
            it('can be passed opts.bootstrapClient', function () {
                expect(archive._bootstrapClient).toBe(bootstrapClient);
            });

            describe('and a .readable listener is added', function () {
                var onReadableSpy;
                beforeEach(function () {
                    onReadableSpy = jasmine.createSpy('CollectionArchive#onReadable');
                    archive.on('readable', onReadableSpy);
                });
                it('emits readable', function () {
                    waitsFor(function () {
                        return onReadableSpy.callCount;
                    });
                    runs(function () {
                        expect(onReadableSpy).toHaveBeenCalled();
                    });
                });
                describe('and readable is emitted', function () {
                    beforeEach(function () {
                        spyOn(archive, '_read').andCallThrough();
                        waitsFor(function () {
                            return onReadableSpy.callCount;
                        });
                    });
                    it('can .read() all content in the headDocument, and ._read is called again to fill the buffer', function () {
                        var headDocumentLength = bootstrapClient.mockInitResponse.headDocument.content.length,
                            states = [],
                            state;
                        while (headDocumentLength--) {
                            state = archive.read();
                            states.push(state);
                        }
                        expect(states.length).toBe(bootstrapClient.mockInitResponse.headDocument.content.length);
                        expect(archive._read).toHaveBeenCalled();
                    });
                    it('does not emit content that was both in the headDocument and rest of bootstrap', function () {
                        var contentIdCounts = {},
                            content,
                            currentCount;
                        // We'll count how many times each content id property appears
                        // in what's read. The mock data includes duplicates across init
                        // and the page response
                        while ( content = archive.read() ) {
                            currentCount = contentIdCounts[content.id];
                            contentIdCounts[content.id] = currentCount ? currentCount + 1 : 1;
                        }
                        for (var contentId in contentIdCounts) {
                            if (contentIdCounts.hasOwnProperty(contentId)) {
                                if ( ! contentIdCounts.hasOwnProperty(contentId)) {
                                    return;
                                }
                                // There should have been one of each content.id
                                expect(contentIdCounts[contentId]).toBe(1);
                            }
                        }
                    });
                });
            });

            it('emits end when there are no more bootstrap pages', function () {
                var onEndSpy = jasmine.createSpy(),
                    contents = [];
                archive.on('end', onEndSpy);
                archive.on('readable', function () {
                    var content;
                    // Read everything always
                    while (content = archive.read()) {
                        contents.push(content);
                    }
                });
                waitsFor(function () {
                    return onEndSpy.callCount;
                }, 'end to be emitted');
            });
        });
        it('reads out replies when constructed with opts.replies = true', function () {
            var bootstrapClient = singlePageBootstrapClient();
            var archive = new CollectionArchive({
                collection: new MockCollection(),
                bootstrapClient: bootstrapClient,
                replies: true
            });
            var stateToContent = archive._createStateToContent();
            expect(stateToContent._replies).toBe(true);
        });

        it('can be configured to read out in descending page order, and it is the default', function () {
            var archivedContent = [];
            var bootstrapClient = multiPageBootstrapClient();
            spyOn(bootstrapClient, 'getContent').andCallThrough();
            var archive = new CollectionArchive({
                collection: new MockCollection({
                    bootstrapClient: bootstrapClient
                }),
                bootstrapClient: bootstrapClient
                // Don't actually pass this as it should be the default
                // ,order: CollectionArchive.comparators.CREATED_AT_DESCENDING
            });
            var ended = false;
            archive.on('data', function (content) {
                archivedContent.push(content);
            });
            archive.once('end', function () {
                ended = true;
            });
            waitsFor(function () {
                return ended;
            });
            runs(function () {
                var requestedPages = bootstrapClient.getContent.calls.map(function (call) {
                    return call.args[0].page;
                });
                var nonInitPages = requestedPages.slice(1);
                var inDescendingOrder = inOrder(nonInitPages, function (a, b) {
                    return b-a;
                });
                expect(inDescendingOrder).toBe(true);
            });
        });

        it('can be configured to read out in ascending page order', function () {
            var archivedContent = [];
            var bootstrapClient = multiPageBootstrapClient();
            spyOn(bootstrapClient, 'getContent').andCallThrough();
            var archive = new CollectionArchive({
                collection: new MockCollection({
                    bootstrapClient: bootstrapClient
                }),
                bootstrapClient: bootstrapClient,
                comparator: CollectionArchive.comparators.CREATED_AT_ASCENDING
            });
            var ended = false;
            archive.on('data', function (content) {
                archivedContent.push(content);
            });
            archive.once('end', function () {
                ended = true;
            });
            waitsFor(function () {
                return ended;
            });
            runs(function () {
                var requestedPageNames = bootstrapClient.getContent.calls.map(function (call) {
                    return call.args[0].page;
                });
                var inAscendingOrder = inOrder(requestedPageNames, function (a, b) {
                    return a-b;
                });
                expect(requestedPageNames.length).toBeGreaterThan(0);
                expect(inAscendingOrder).toBe(true);
            });
        });
    });
});
