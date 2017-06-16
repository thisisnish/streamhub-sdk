var CarouselContentView = require('streamhub-sdk/content/views/carousel-content-view');
var fixtures = require('json!streamhub-sdk-tests/fixtures/featured-all.json').content;
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var SortedCollection = require('streamhub-sdk/collection/sorted');

describe('CarouselContentView', function () {
    it('initializes', function () {
        var view = new CarouselContentView({content: new LivefyreContent(fixtures[0])});
        expect(view instanceof CarouselContentView).toBe(true);
    });

    it('falls back to a content modal when a collection is not provided', function () {
        var view = new CarouselContentView({
            content: new LivefyreContent(fixtures[0]),
            productOptions: {}
        });
        view.render();
        expect(view.$el.find(view.arrowLeftSelector).length).toBe(0);
        expect(view.$el.find(view.arrowRightSelector).length).toBe(0);
    });

    describe('is navigatable -- ', function () {
        var sortedCollection;
        var view;

        beforeEach(function () {
            sortedCollection = new SortedCollection();
            sortedCollection.add(new LivefyreContent(fixtures[0]));

            view = new CarouselContentView({
                collection: sortedCollection,
                content: new LivefyreContent(fixtures[0]),
                productOptions: {}
            });
            view.render();
        });

        it('updates when new content is received', function () {
            spyOn(view, 'updateContentIndex').andCallThrough();
            spyOn(view, 'maybeToggleArrows').andCallThrough();
            sortedCollection.add(new LivefyreContent(fixtures[1]));
            expect(view.updateContentIndex.callCount).toBe(1);
            expect(view.maybeToggleArrows.callCount).toBe(1);
        });

        it('has arrows that update the current visible content', function () {
            expect(view.content.id).toEqual(fixtures[0].content.id);
            expect(view.contentIdx).toBe(0);
            sortedCollection.add(new LivefyreContent(fixtures[1]));
            expect(view.contentIdx).toBe(1);
            view.$el.find(view.arrowLeftSelector).click();
            expect(view.content.id).toEqual(fixtures[1].content.id);
            expect(view.contentIdx).toBe(0);
        });

        it('toggles the arrows to show that no content remains in that direction', function () {
            expect(view.$el.find(view.arrowLeftSelector).hasClass(view.arrowDisabledClass)).toBe(true);
            sortedCollection.add(new LivefyreContent(fixtures[1]));
            expect(view.$el.find(view.arrowLeftSelector).hasClass(view.arrowDisabledClass)).toBe(false);
        });

        it('triggers "show more" functionality when oldest content has been reached', function () {
            var listView = {'$el': {trigger: function () {}}};
            spyOn(listView.$el, 'trigger');
            view = new CarouselContentView({
                collection: sortedCollection,
                content: new LivefyreContent(fixtures[0]),
                listView: listView,
                productOptions: {}
            });
            view.render();
            sortedCollection.add(new LivefyreContent(fixtures[1]));
            view.$el.find(view.arrowLeftSelector).click();
            expect(listView.$el.trigger.callCount).toBe(0);
            view.$el.find(view.arrowRightSelector).click();
            expect(listView.$el.trigger.callCount).toBe(1);
            expect(listView.$el.trigger.calls[0].args[0]).toEqual('showMore.hub');
        });
    });
});
