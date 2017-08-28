var fixtures = require('json!streamhub-sdk-tests/fixtures/featured-all.json').content;
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var SortedCollection = require('streamhub-sdk/collection/sorted');

describe('SortedCollection', function () {
    var collection;

    beforeEach(function () {
        collection = new SortedCollection();
    });

    describe('add', function () {
        it('emits events when content is added', function (done) {
            var called = false;
            collection.on('added', function () {
                called = true;
            });
            collection.add(new LivefyreContent(fixtures[0]));
            expect(called).toBe(true);
        });

        it('does not add duplicates', function () {
            var called = false;
            collection.add(new LivefyreContent(fixtures[0]));
            collection.on('added', function () {
                called = true;
            });
            collection.add(new LivefyreContent(fixtures[0]));
            expect(collection.contents.length).toBe(1);
            expect(called).toBe(false);
        });

        it('sorts the content based on createdAt', function () {
            for (var i = 0; i < fixtures.length; i++) {
                collection.add(new LivefyreContent(fixtures[i]));
            }
            expect(collection.contents[0].id).toEqual(fixtures[8].content.id);
            expect(collection.contents[1].id).toEqual(fixtures[7].content.id);
            expect(collection.contents[2].id).toEqual(fixtures[6].content.id);
            expect(collection.contents[3].id).toEqual(fixtures[5].content.id);
            expect(collection.contents[4].id).toEqual(fixtures[4].content.id);
            expect(collection.contents[5].id).toEqual(fixtures[3].content.id);
            expect(collection.contents[6].id).toEqual(fixtures[1].content.id);
            expect(collection.contents[7].id).toEqual(fixtures[0].content.id);
            expect(collection.contents[8].id).toEqual(fixtures[2].content.id);
            expect(collection.contents[9].id).toEqual(fixtures[11].content.id);
            expect(collection.contents[10].id).toEqual(fixtures[10].content.id);
            expect(collection.contents[11].id).toEqual(fixtures[9].content.id);
        });

        it('sorts the content based on sortOrder', function () {
            collection._order = 'sortOrder';
            for (var i = 0; i < fixtures.length; i++) {
                collection.add(new LivefyreContent(fixtures[i]));
            }
            expect(collection.contents[0].id).toEqual(fixtures[8].content.id);
            expect(collection.contents[1].id).toEqual(fixtures[7].content.id);
            expect(collection.contents[2].id).toEqual(fixtures[6].content.id);
            expect(collection.contents[3].id).toEqual(fixtures[5].content.id);
            expect(collection.contents[4].id).toEqual(fixtures[4].content.id);
            expect(collection.contents[5].id).toEqual(fixtures[3].content.id);
            expect(collection.contents[6].id).toEqual(fixtures[1].content.id);
            expect(collection.contents[7].id).toEqual(fixtures[11].content.id);
            expect(collection.contents[8].id).toEqual(fixtures[0].content.id);
            expect(collection.contents[9].id).toEqual(fixtures[2].content.id);
            expect(collection.contents[10].id).toEqual(fixtures[10].content.id);
            expect(collection.contents[11].id).toEqual(fixtures[9].content.id);
        });
    });

    describe('setSortOrder', function () {
        beforeEach(function () {
            collection.add(new LivefyreContent(fixtures[0]));
            collection.add(new LivefyreContent(fixtures[1]));
            spyOn(collection.contents, 'sort').andCallThrough();
        });

        it('does nothing if no order is provided', function () {
            collection.setSortOrder();
            expect(collection._order).toEqual('createdAt');
            expect(collection.contents.sort).not.toHaveBeenCalled();
        });

        it('does nothing if new sort order is the same as current', function () {
            collection.setSortOrder('createdAt');
            expect(collection._order).toEqual('createdAt');
            expect(collection.contents.sort).not.toHaveBeenCalled();
        });

        it('sorts the existing content', function () {
            collection.setSortOrder('-sortOrder');
            expect(collection._order).toEqual('sortOrder');
            expect(collection.contents.sort).toHaveBeenCalled();
        });
    });
});
