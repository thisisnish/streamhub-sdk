var FakeCollection = require('streamhub-sdk/collection/fake');
var fixtures = require('json!streamhub-sdk-tests/fixtures/featured-all.json').content;
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');

describe('FakeCollection', function () {
    var collection;

    beforeEach(function () {
        collection = new FakeCollection();
    });

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
});
