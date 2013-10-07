define([
    'jasmine',
    'streamhub-sdk/collection/streams/featured-contents',
    'streamhub-sdk-tests/mocks/collection/mock-collection',
    'stream/readable'],
function (jasmine, FeaturedContents, MockCollection, Readable) {
    'use strict';

    describe('streamhub-sdk/streams/featured-content', function () {

        it('can be constructed with a Collection', function () {
            var collection = new MockCollection({
                withFeaturedInit: true
            });
            var featuredContents = new FeaturedContents({
                collection: collection
            });
            expect(featuredContents instanceof FeaturedContents);
            expect(featuredContents._collection).toBe(collection);
        });

        it('emits readable and reads out items from bootstrapInit.featured', function () {
            var collection = new MockCollection({
                withFeaturedInit: true
            });
            var featuredContents = new FeaturedContents({
                collection: collection
            });
            var onReadable = jasmine.createSpy('on readable');
            featuredContents.on('readable', onReadable);
            waitsFor(function () {
                return onReadable.callCount;
            });
            runs(function () {
                var content = featuredContents.read();
                expect(content.isFeatured()).toBe(true);
            });
        });

        it('reads out from featured-head.json after reading from init', function () {

        });

        it('does not emit duplicates across featured-head and init', function () {

        });

        it('emits end immediately if there is no featured Content', function () {

        });

        it('emits end when there are no more featured Contents', function () {
            var onEndSpy = jasmine.createSpy();
        });
    });
});