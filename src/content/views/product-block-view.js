var $ = require('streamhub-sdk/jquery');
var i18n = require('streamhub-sdk/i18n');
var inherits = require('inherits');
var size = require('mout/object/size');
var template = require('hgn!streamhub-sdk/content/templates/product-block');
var View = require('streamhub-sdk/view');

'use strict';

/**
 * A version of the tiled attachement list view that only shows a single image
 * @param opts {Object} A set of options to config the view with
 * @param opts.el {HTMLElement} The element in which to render the streamed content
 * @param opts.content {Content} The content instance with which to display its attachments
 * @fires TiledAttachmentListView#focusContent.hub
 * @exports streamhub-sdk/views/ProductBlockView
 * @constructor
 */
var ProductBlockView = function (opts) {
    View.call(this, opts);
};
inherits(ProductBlockView, View);

ProductBlockView.prototype.elTag = 'div';
ProductBlockView.prototype.elClass = 'product-block';
ProductBlockView.prototype.template = template;

/**
 * Builds a product url with the provided product url and the analytics
 * configuration object. String replacements are done for the content `source`
 * type (e.g. twitter, instagram) and the id `contentId` of the content for
 * additional analytics tracking purposes.
 * @return {string}
 */
ProductBlockView.prototype.buildProductUrl = function () {
    var analytics = this.opts.productOptions.analytics;
    var analyticsPath = [];
    var content = this.opts.content;
    var productUrl = this.opts.product.url;

    if (!size(analytics)) {
        return productUrl;
    }

    function stringRepl(str) {
        return str
            .replace('{source}', content.source)
            .replace('{contentId}', content.id);
    }

    for (var key in analytics) {
        if (analytics.hasOwnProperty(key)) {
            analyticsPath.push(key + '=' + stringRepl(analytics[key]));
        }
    }

    var urlParamPrefix = productUrl.indexOf('?') > -1 ? '&' : '?';
    return [productUrl, urlParamPrefix, analyticsPath.join('&')].join('');
};

/** @override */
ProductBlockView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this.opts);
    context.aria = this.opts.product.title;
    context.productButtonText = i18n.get('productButtonText', 'Buy Now');
    context.productDetailPriceShow = this.opts.productOptions.detail.price;
    context.productDetailTitleShow = this.opts.productOptions.detail.title;
    context.productUrl = this.buildProductUrl();
    return context;
};

/** @override */
ProductBlockView.prototype.render = function () {
    View.prototype.render.call(this);

    var productOembed = this.opts.product.oembed || {};
    if (!this.opts.productOptions.detail.photo || !productOembed.url) {
        return this;
    }

    // Render the image directly here so that we can handle the case where it's
    // a bad image. Don't want to show a dead section.
    var destination = this.$el.find('a');
    var img = new Image();
    img.className = 'product-media';
    img.alt = productOembed.title;
    img.onload = function () {
        destination.prepend(img);
    }.bind(this);
    img.src = productOembed.url;
    return this;
};

module.exports = ProductBlockView;
