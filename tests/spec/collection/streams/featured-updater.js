var FeaturedUpdater = require('streamhub-sdk/collection/streams/featured-updater');
var Collection = require('streamhub-sdk/collection');
var MockCollection = require('streamhub-sdk-tests/mocks/collection/mock-collection');
var CollectionUpdater = require('streamhub-sdk/collection/streams/updater');
var Annotator = require('streamhub-sdk/content/annotator');

'use strict';

describe('streamhub-sdk/collection/streams/featured-updater', function () {
    var featuredUpdater;
    beforeEach(function () {
        featuredUpdater = new FeaturedUpdater({
            collection: new MockCollection()
        });
    });

    describe('on construction', function () {
        it('has a CollectionUpdater', function () {
            expect(featuredUpdater._updater instanceof CollectionUpdater).toBe(true);
        });

        it('has a Annotator', function () {
            expect(featuredUpdater._annotator instanceof Annotator).toBe(true);
        });

        it('observes "annotationDiff" event emitted by the CollectionUpdater', function () {
            expect(featuredUpdater._updater._listeners.annotationDiff.length).toBe(1);
        });
    });

    describe('handleAnnotations', function () {
        it('is handler for "annotationDiff" event emitted by the CollectionUpdater', function () {
            spyOn(featuredUpdater, 'handleAnnotations');
            var mockAnnotationDiff = {
                added: 'yay'
            };
            featuredUpdater._updater._handleAnnotationDiff('content1234', mockAnnotationDiff);
            expect(featuredUpdater.handleAnnotations).toHaveBeenCalled();
        });
    });
});
