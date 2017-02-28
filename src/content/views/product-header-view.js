var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var template = require('hgn!streamhub-sdk/content/templates/product-header');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var debug = require('debug');

var log = debug('streamhub-sdk/content/views/product-header-view');

'use strict';

/**
 * A view that displays a content item's header.
 * Includes the avatar, content byline, and source-type logo
 * @param opts {Object} A set of options to config the view with
 * @param opts.el {HTMLElement} The element in which to render the streamed content
 * @param opts.content {Content} The content instance with which to display its header
 * @exports streamhub-sdk/views/content-header-view
 * @constructor
 */
var ProductHeaderView = function (opts) {
    opts = opts || {};
    ContentHeaderView.call(this, opts);
};
inherits(ProductHeaderView, ContentHeaderView);

ProductHeaderView.prototype.template = template;
ProductHeaderView.prototype.elTag = 'section';
ProductHeaderView.prototype.elClass = 'product-header';

ProductHeaderView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this.opts);
    context.shopIndicationText = "Shop"
    return context;
};

module.exports = ProductHeaderView;
