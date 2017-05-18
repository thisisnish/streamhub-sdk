var i18n = require('streamhub-sdk/i18n');
var ProductCalloutView = require('streamhub-sdk/content/views/product-callout-view');

describe('ProductCalloutView', function () {
    beforeEach(function () {
        i18n.reset();
    });

    it('renders nothing if products are not configured to show', function () {
        var view = new ProductCalloutView({productOptions: {show: false}});
        view.render();
        expect(view.$el.html()).toEqual('');
    });

    it('renders nothing if there is not product indication text', function () {
        i18n.set('productIndicationText', ' ');
        view = new ProductCalloutView({productOptions: {show: true}});
        view.render();
        expect(view.$el.html()).toEqual('');
    });

    it('renders the button if enabled and has copy', function () {
        var view = new ProductCalloutView({productOptions: {show: true}});
        view.render();
        expect(view.$el.html().trim()).toEqual('<span class="product-shop-button">Shop</span>');

        i18n.set('productIndicationText', '');
        view = new ProductCalloutView({productOptions: {show: true}});
        view.render();
        expect(view.$el.html().trim()).toEqual('<span class="product-shop-button">Shop</span>');

        i18n.set('productIndicationText', 'blah');
        var view = new ProductCalloutView({productOptions: {show: true}});
        view.render();
        expect(view.$el.html().trim()).toEqual('<span class="product-shop-button">blah</span>');
    });
});
