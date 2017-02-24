var $ = require('streamhub-sdk/jquery');
var template = require('hgn!streamhub-sdk/content/templates/product-carousel');
var CompositeView = require('view/composite-view');
var ProductBlockView = require('streamhub-sdk/content/views/product-block-view');
var View = require('view/view');
var inherits = require('inherits');

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
    CompositeView.call(this, opts);
    this._addInitialChildViews(opts);
};
inherits(ProductCarouselView, CompositeView);

ProductCarouselView.prototype.template = template;
ProductCarouselView.prototype.elTag = 'section';
ProductCarouselView.prototype.elClass = 'product-carousel';
ProductCarouselView.prototype.listClass = 'product-carousel-list';

/**
 * @param {Object} opts
 * @param {boolean=} shouldRender
 */
ProductCarouselView.prototype._addInitialChildViews = function (opts) {
    for (var i = 0; opts.content.products && i < opts.content.products.length; i++) {
        this.add(new ProductBlockView({
            product: opts.content.products[i],
            buyButtonText: opts.buyButtonText
        }));
    }
};

ProductCarouselView.prototype.add = function (view) {
    this._childViews.push(view);
    return this;
};

ProductCarouselView.prototype.render = function (view, opts) {
    View.prototype.render.call(this);
    for (var i=0; i < this._childViews.length; i++) {
        var childView = this._childViews[i];
        this.$el.find('.' + this.listClass).append(childView.el);
        childView.render();
    }
    return this;
};

ProductCarouselView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this.opts);
    context.productCarouselTitle = "Shop these products:"
    return context;
};

module.exports = ProductCarouselView;
