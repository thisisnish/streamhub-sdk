define([
    'streamhub-sdk/collection',
    'streamhub-sdk/collection/streams/updater',
    'streamhub-sdk/collection/followers',
    'streamhub-sdk-tests/mocks/collection/mock-collection',
    'streamhub-sdk-tests/mocks/collection/clients/mock-stream-client'
], function (Collection, CollectionUpdater, Followers, MockCollection, MockLivefyreStreamClient) {
    'use strict';

    describe('streamhub-sdk/collection/followers', function () {
        var collection, followers, updater;

        beforeEach(function () {
            collection = new MockCollection();

            updater = new CollectionUpdater({
                collection: collection,
                streamClient: new MockLivefyreStreamClient()
            });

            spyOn(collection, 'getOrCreateUpdater').andCallFake(function() {
                return updater;
            });

            followers = new Followers(collection);
        });

        describe('calls bootstrap init', function () {
            it('fetches bootstrap data', function () {
                var spy = jasmine.createSpy('spy');
                followers.on('followers', spy);
                expect(spy).toHaveBeenCalledWith([{
                    id: 'system@labs-t402.fyre.co',
                    following: true
                }]);
            });

            it('emits an error if bootstrap fails', function (done) {
                var error = {
                    msg: 'there was an error',
                    statusCode: 500
                };
                spyOn(collection, '_handleInitComplete').andCallFake(function() {
                    collection.emit('_initFromBootstrap', error);
                });
                followers.on('error', function (err) {
                    expect(err).toEqual(error);
                    done();
                });
            });
        });

        it('listens for stream data', function () {
            var contents = [];
            var spy = jasmine.createSpy('spy');
            followers.on('followers', spy);

            updater.on('data', function (content) {
                contents.push(content);
            });

            waitsFor(function () {
                return contents.length;
            });

            runs(function () {
                updater.pause();
                expect(spy).toHaveBeenCalledWith([{
                    id: '_up4729638@livefyre.com',
                    following: true
                }]);
            });
        });

        describe('waits until listeners are added before fetching data', function () {
            it('waits for listeners', function () {
                expect(collection.getOrCreateUpdater).not.toHaveBeenCalled();
                followers.on('followers', jasmine.createSpy('spy'));
                expect(collection.getOrCreateUpdater).toHaveBeenCalled();
            });

            it('only initializes once', function () {
                expect(collection.getOrCreateUpdater).not.toHaveBeenCalled();
                followers.on('followers', jasmine.createSpy('spy'));
                expect(collection.getOrCreateUpdater).toHaveBeenCalled();
                expect(collection.getOrCreateUpdater.calls.length).toEqual(1);
                followers.on('followers', jasmine.createSpy('spy'));
                expect(collection.getOrCreateUpdater.calls.length).toEqual(1);
            });
        });
    });
});
