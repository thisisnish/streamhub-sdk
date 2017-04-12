var Content = require('streamhub-sdk/content');
var ContentView = require('streamhub-sdk/content/views/content-view');
var hasSpectrum = require('streamhub-sdk/content/views/mixins/spectrum-content-view-mixin');

describe('SpectrumContentView mixin', function () {
    it('modifies the default class', function () {
        var contentView = new ContentView({content: new Content()});
        hasSpectrum(contentView);
        expect(contentView.elClass).toBe('content spectrum-content');
    });

    describe('_addInitialChildViews', function () {
        it('re-orders the child views that are added to the view', function () {
            var content = new Content({
                body: 'test',
                productOptions: {detail: {photo: true, price: true, title: true}, show: true}
            });
            content.set({links: {product: [{title: 'abc', price: '$6.66'}]}});
            var contentView = new ContentView({content: content});
            var spy = spyOn(contentView, 'add');
            hasSpectrum(contentView);
            contentView.refreshChildViews();
            expect(spy.calls.length).toBe(5);
            expect(spy.calls[0].args[0]).toEqual(contentView._attachmentsView);
            expect(spy.calls[1].args[0]).toEqual(contentView._headerView);
            expect(spy.calls[2].args[0]).toEqual(contentView._bodyView);
            expect(spy.calls[3].args[0]).toEqual(contentView._footerView);
            expect(spy.calls[4].args[0]).toEqual(contentView._productCalloutView);
        });
    });
});
