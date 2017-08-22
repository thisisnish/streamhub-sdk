var deepClone = require('mout/lang/deepClone');
var merge = require('mout/object/merge');
var ProductBlockView = require('streamhub-sdk/content/views/product-block-view');

var DEFAULT_OPTIONS = {
    content: {id: 'abc', source: 'def'},
    product: {url: 'http://google.com'},
    productOptions: {analytics: {}}
};

function getView(opts) {
    return new ProductBlockView(opts || deepClone(DEFAULT_OPTIONS));
}

describe('ProductBlockView', function () {
    describe('handles images in a special way', function () {
        it('skips if not enabled', function () {
            var view = getView(merge(DEFAULT_OPTIONS, {
                product: {oembed: {url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Bob_Dole%2C_PCCWW_photo_portrait.JPG'}},
                productOptions: {detail: {photo: false}}
            }));
            view.render();
            expect(view.$el.find('.product-media').length).toBe(0);
        });

        it('skips if no image is available', function () {
            var view = getView(merge(DEFAULT_OPTIONS, {
                productOptions: {detail: {photo: true}}
            }));
            view.render();
            expect(view.$el.find('.product-media').length).toBe(0);
        });

        it('skips if image is invalid', function () {
            var view = getView(merge(DEFAULT_OPTIONS, {
                product: {oembed: {url: 'http://abc'}},
                productOptions: {detail: {photo: true}}
            }));
            view.render();
            expect(view.$el.find('.product-media').length).toBe(0);
        });

        it('adds if image is valid', function () {
            var view = getView(merge(DEFAULT_OPTIONS, {
                product: {oembed: {
                    title: 'a title',
                    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Bob_Dole%2C_PCCWW_photo_portrait.JPG'
                }},
                productOptions: {detail: {photo: true}}
            }));
            view.render();

            waitsFor(function () {
                return view.$el.find('.product-media').length > 0;
            });
            runs(function () {
                var $a = view.$el.find('.product-media');
                expect($a.attr('alt')).toEqual('a title');
                expect($a.attr('src')).toEqual('https://upload.wikimedia.org/wikipedia/commons/4/4f/Bob_Dole%2C_PCCWW_photo_portrait.JPG');
            });
        });
    });

    describe('.buildProductUrl', function () {
        it('does nothing if no analytics options are provided', function () {
            expect(getView().buildProductUrl()).toEqual('http://google.com');
        });

        it('concatenates all analytics options to product url', function () {
            var view = getView();
            view.opts.productOptions.analytics = {
                cid: '123',
                another: 'something'
            };
            expect(view.buildProductUrl()).toEqual('http://google.com?cid=123&another=something');

            view.opts.product.url = 'http://google.com?one=two';
            expect(view.buildProductUrl()).toEqual('http://google.com?one=two&cid=123&another=something');
        });

        describe('does string replacements', function () {
            it('for {source} to have social provider', function () {
                var view = getView();
                view.opts.productOptions.analytics = {
                    cid: 'abc-{source}-123'
                };
                expect(view.buildProductUrl()).toEqual('http://google.com?cid=abc-def-123');
            });

            it('for {contentId} to include content id', function () {
                var view = getView();
                view.opts.productOptions.analytics = {
                    cid: 'abc-{contentId}-123'
                };
                expect(view.buildProductUrl()).toEqual('http://google.com?cid=abc-abc-123');
            });
        });
    });
});
