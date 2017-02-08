var template = require('hgn!streamhub-sdk/content/templates/product-carousel');
var View = require('streamhub-sdk/view');
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
    View.call(this, opts);
};
inherits(ProductCarouselView, View);

ProductCarouselView.prototype.template = template;
ProductCarouselView.prototype.bodySelector = '.product-carousel-body';

module.exports = ProductCarouselView;
