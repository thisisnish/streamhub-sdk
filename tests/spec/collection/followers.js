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

        it('calls bootstrap init', function () {
            var spy = jasmine.createSpy('spy');
            followers.on('followers', spy);
            expect(spy).toHaveBeenCalledWith([{
                id: 'system@labs-t402.fyre.co',
                following: true
            }]);
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

        it('waits to retrieve data until listeners have been attached', function () {
            expect(collection.getOrCreateUpdater).not.toHaveBeenCalled();
            followers.on('followers', jasmine.createSpy('spy'));
            expect(collection.getOrCreateUpdater).toHaveBeenCalled();
        });

        it('only initializes the collection once if multiple listeners are attached', function () {
            expect(collection.getOrCreateUpdater).not.toHaveBeenCalled();
            followers.on('followers', jasmine.createSpy('spy'));
            expect(collection.getOrCreateUpdater).toHaveBeenCalled();
            expect(collection.getOrCreateUpdater.calls.length).toEqual(1);
            followers.on('followers', jasmine.createSpy('spy'));
            expect(collection.getOrCreateUpdater.calls.length).toEqual(1);
        });
    });
});
