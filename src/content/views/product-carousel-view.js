var $ = require('streamhub-sdk/jquery');
var CompositeView = require('view/composite-view');
var i18n = require('streamhub-sdk/i18n');
var inherits = require('inherits');
var ProductBlockView = require('streamhub-sdk/content/views/product-block-view');
var template = require('hgn!streamhub-sdk/content/templates/product-carousel');

'use strict';

/**
 * A version of the tiled attachement list view that only shows a single image
 * @param opts {Object} A set of options to config the view with
 * @param opts.el {HTMLElement} The element in which to render the streamed content
 * @param opts.content {Content} The content instance with which to display its attachments
 * @fires TiledAttachmentListView#focusContent.hub
 * @exports streamhub-sdk/views/ProductCarouselView
 * @constructor
 */
var ProductCarouselView = function (opts) {
    opts = opts || {};
    this.products = opts.content.links && opts.content.links.product
    CompositeView.call(this, opts);
    this._addInitialChildViews(opts);
};
inherits(ProductCarouselView, CompositeView);

ProductCarouselView.prototype.template = template;
ProductCarouselView.prototype.elTag = 'section';
ProductCarouselView.prototype.elClass = 'product-carousel';
ProductCarouselView.prototype.listClass = 'product-carousel-list';
ProductCarouselView.prototype.leftSelector = '.product-carousel-left-arrow';
ProductCarouselView.prototype.rightSelector = '.product-carousel-right-arrow';
ProductCarouselView.prototype.hideClass = 'hide';

ProductCarouselView.prototype.events = CompositeView.prototype.events.extended({}, function (events) {
    var carouselSelectors = [
        this.leftSelector,
        this.rightSelector
    ].join(',');

    events['click ' + carouselSelectors] = function (e) {
        var listEl = this.$el.find('.' + this.listClass);
        var position = listEl.position().left;
        e.stopPropagation();
        if ($(e.currentTarget).hasClass(this.leftSelector.substring(1)) && position < 0) {
            listEl.offset({left: listEl.offset().left + 135});
            this.$el.find(this.rightSelector).removeClass(this.hideClass);
            if (listEl.position().left > 0) {
                this.$el.find(this.leftSelector).addClass(this.hideClass);
            }
        } else if ($(e.currentTarget).hasClass(this.rightSelector.substring(1)) && this.products && position > -((this.products.length - 3) * 135)) {
            listEl.offset({left: listEl.offset().left - 135});
            this.$el.find(this.leftSelector).removeClass(this.hideClass);
            if (listEl.position().left < -((this.products.length - 3) * 135)) {
                this.$el.find(this.rightSelector).addClass(this.hideClass);
            }
        }
    };
});

/**
 * @param {Object} opts
 * @param {boolean=} shouldRender
 */
ProductCarouselView.prototype._addInitialChildViews = function (opts) {
    for (var i = 0; this.products && i < this.products.length; i++) {
        this.add(new ProductBlockView({
            product: this.products[i],
            productOptions: opts.productOptions
        }));
    }
};

ProductCarouselView.prototype.add = function (view) {
    this._childViews.push(view);
    return this;
};

ProductCarouselView.prototype.render = function (view, opts) {
    var self = this;
    this.$el.html(this.template(this.getTemplateContext()));
    for (var i=0; i < this._childViews.length; i++) {
        var childView = this._childViews[i];
        this.$el.find('.' + this.listClass).append(childView.el);
        childView.render();
    }

    // set carousel nvaigation buttons initial state
    this.$el.find(this.leftSelector).addClass(this.hideClass);
    if (this.products.length < 3) {
        this.$el.find(this.rightSelector).addClass(this.hideClass);
    }

    // vertically aligning the carousel nave buttons
    setTimeout(function(){
        var navMarginHeight = (self.$el.find('.product-carousel-body').height() - 15) / 2;
        self.$el.find(self.rightSelector).css('margin-top', navMarginHeight);
        self.$el.find(self.leftSelector).css('margin-top', navMarginHeight);
    }, 0);

    return this;
};

ProductCarouselView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this.opts);
    var productCarouselTitleText = i18n.get('productCarouselTitleText', 'Shop these products:');
    context.productCarouselTitleText = productCarouselTitleText;
    context.productCarouselTitleShow = productCarouselTitleText.length > 0;
    return context;
};

module.exports = ProductCarouselView;
