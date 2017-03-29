define([
    'jquery',
    'streamhub-sdk/util',
    'streamhub-sdk/content',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/views/modal-content-card-view'],
function (
    $,
    util,
    Content,
    LivefyreContent,
    ModalContentCardView) {
    'use strict';

    describe('Default modal content card view', function () {

        describe('when constructed', function () {
            var modalView = new ModalContentCardView({ content: new Content('blah') });
            it('has a .createdAt Date', function () {
                expect(modalView.createdAt instanceof Date).toBe(true);
            });
        });

        describe('when image attachment loads', function() {
            var attachment = {
                provider_name: "Twimg",
                provider_url: "http://pbs.twimg.com",
                type: "photo",
                url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg"
            };
            var content = new Content({ body: 'what' });
            content.addAttachment(attachment);
            var modalView = new ModalContentCardView({ content: content });
            modalView.render();

            it('has .content-with-image', function() {
                expect(modalView.$el.html()).toContain('content-attachment-photo');
            });
        });

        describe('when products load', function() {
            var attachment = {
                    provider_name: "Twimg",
                    provider_url: "http://pbs.twimg.com",
                    type: "photo",
                    url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg"
                },
                links = {
                    "product": [{
                        "oembed": {"url": "http://www.hallmark.com/dw/image/v2/AALB_PRD/on/demandware.static/-/Sites-hallmark-master/default/dwdc14a30c/images/finished-goods/itty-bittys-My-Little-Pony-Rainbow-Dash-Stuffed-Animal-root-1KDD1252_KDD1252_1470_1.jpg_Source_Image.jpg?sw=625&sh=625&sm=fit"},
                        "price": "$6.95",
                        "title": "itty bittys® My Little Pony™ Rainbow Dash Stuffed Animal",
                        "url": "http://www.hallmark.com/gifts/stuffed-animals/itty-bittys/itty-bittys-my-little-pony-rainbow-dash-stuffed-animal-1KDD1252.html",
                        "urn": "urn:livefyre:qa-blank.fyre.co:product=a012b658-4ced-452a-8a6a-108bb1c99879"
                }]},
                content = new Content({ body: 'what' });
            content.links = links;
            content.addAttachment(attachment);

            it('has products', function() {
                var modalView = new ModalContentCardView({
                    content: content,
                    showProduct: true,
                    productDetailPhotoShow: true,
                    productDetailTitleShow: true,
                    productDetailPriceShow: true
                });
                modalView.render();
                expect(modalView.$el.html()).toContain('product-carousel-list');
                expect(modalView.$el.html()).toContain('buy-button');
                expect(modalView.$el.html()).toContain('product-media');
                expect(modalView.$el.html()).toContain('product-name');
                expect(modalView.$el.html()).toContain('product-price');
            });

            it('don\'t show products', function() {
                var modalView = new ModalContentCardView({
                    content: content,
                    showProduct: false
                });
                modalView.render();
                expect(modalView.$el.html().indexOf('product-carousel-list') === -1).toBe(true);
            });

            it('shows product header', function() {
                var modalView = new ModalContentCardView({
                    content: content,
                    showProduct: true,
                    productCarouselTitleText: 'Product List',
                    productCarouselTitleShow: true,
                });
                modalView.render();
                expect(modalView.$el.html()).toContain('Product List');
                expect(modalView.$el.html()).toContain('product-carousel-header');
            });

            it('don\'t show product image', function() {
                var modalView = new ModalContentCardView({
                    content: content,
                    showProduct: true,
                    productDetailPhotoShow: false,
                    productDetailTitleShow: true,
                    productDetailPriceShow: true
                });
                modalView.render();
                expect(modalView.$el.html().indexOf('product-media') === -1).toBe(true);
                expect(modalView.$el.html()).toContain('product-name');
                expect(modalView.$el.html()).toContain('product-price');
            });

            it('don\'t show product price', function() {
                var modalView = new ModalContentCardView({
                    content: content,
                    showProduct: true,
                    productDetailPhotoShow: true,
                    productDetailTitleShow: true,
                    productDetailPriceShow: false
                });
                modalView.render();
                expect(modalView.$el.html()).toContain('product-media');
                expect(modalView.$el.html()).toContain('product-name');
                expect(modalView.$el.html().indexOf('product-price') === -1).toBe(true);
            });

            it('don\'t show product title', function() {
                var modalView = new ModalContentCardView({
                    content: content,
                    showProduct: true,
                    productDetailPhotoShow: true,
                    productDetailTitleShow: false,
                    productDetailPriceShow: true
                });
                modalView.render();
                expect(modalView.$el.html()).toContain('product-media');
                expect(modalView.$el.html().indexOf('product-name') === -1).toBe(true);
                expect(modalView.$el.html()).toContain('product-price');
            });

            it('customize buy button label', function() {
                var modalView = new ModalContentCardView({
                    content: content,
                    showProduct: true,
                    productButtonText: 'Buy This'
                });
                modalView.render();
                expect(modalView.$el.html()).toContain('buy-button');
                expect(modalView.$el.html()).toContain('Buy This');
            });
        });

    });
});
