var ContentHeaderViewFactory = require('streamhub-sdk/content/content-header-view-factory');
var deepClone = require('mout/lang/deepClone');

var content = {
    author: {displayName: 'abc'},
    typeUrn: 'urn:livefyre:js:streamhub-sdk:content:types:livefyre'
};

var productOpts1 = {
    productIndicationText: 'Buy',
    showProduct: true
};

var productOpts2 = {
    productIndicationText: 'Shop',
    showProduct: false
};

describe('ContentHeaderViewFactory', function () {
    var contentHeaderViewFactory;

    beforeEach(function () {
        contentHeaderViewFactory = new ContentHeaderViewFactory();
    });

    describe('when constructed', function () {
        it('takes no arguments', function () {
            expect(contentHeaderViewFactory).toBeDefined();
        });

        it('is instance of ContentHeaderViewFactory', function () {
            expect(contentHeaderViewFactory instanceof ContentHeaderViewFactory).toBe(true);
        });
    });

    describe('_getHeaderViewOptsForContent', function () {
        var opts;

        beforeEach(function () {
            opts = deepClone(content);
            opts.author.displayName = null;
        });

        it('uses displayName if there', function () {
            opts.author.displayName = 'bob dole';
            var result = contentHeaderViewFactory._getHeaderViewOptsForContent(opts);
            expect(result).toEqual({
                author: {displayName: 'bob dole'},
                contentSourceName: 'livefyre'
            });
        });

        it('uses handle if no displayName', function () {
            opts.author.handle = 'bobdole';
            var result = contentHeaderViewFactory._getHeaderViewOptsForContent(opts);
            expect(result).toEqual({
                author: {
                    displayName: 'bobdole',
                    handle: 'bobdole'
                },
                contentSourceName: 'livefyre'
            });
        });

        it('uses profileUrl if no displayName and no handle', function () {
            opts.author.profileUrl = 'http://test.com/profile/bobdole';
            var result = contentHeaderViewFactory._getHeaderViewOptsForContent(opts);
            expect(result).toEqual({
                author: {
                    displayName: 'bobdole',
                    profileUrl: 'http://test.com/profile/bobdole'
                },
                contentSourceName: 'livefyre'
            });
        });

        it('leaves the displayName empty if there is no handle or profileUrl', function () {
            var result = contentHeaderViewFactory._getHeaderViewOptsForContent(opts);
            expect(result).toEqual({
                author: {displayName: null},
                contentSourceName: 'livefyre'
            });
        });

        it('creates a content header', function () {
            var header = contentHeaderViewFactory.createHeaderView(content);
            expect(header.elClass).toEqual('content-header');
        });

        it('creates a product header', function () {
            var header = contentHeaderViewFactory.createHeaderView(content, productOpts1);
            expect(header.elClass).toEqual('product-header');
        });

        it('creates a customized product header', function () {
            var productHeader = contentHeaderViewFactory.createHeaderView(content, productOpts1);
            productHeader.render();
            expect(productHeader.$el.html()).toContain('<span class="product-shop-button">Buy</span>');
        });

        it('turns off the product indicator in a product header', function () {
            var productHeader = contentHeaderViewFactory.createHeaderView(content, productOpts2);
            productHeader.render();
            expect(productHeader.$el.html().indexOf('<span class="product-shop-button">') === -1).toBe(true);
        });
    });
});
