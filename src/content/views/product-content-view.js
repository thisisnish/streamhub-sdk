var $ = require('streamhub-sdk/jquery');
var CompositeView = require('view/composite-view');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var ContentBodyView = require('streamhub-sdk/content/views/content-body-view');
var ContentFooterView = require('streamhub-sdk/content/views/content-footer-view');
var ContentHeaderViewFactory = require('streamhub-sdk/content/content-header-view-factory');
var ProductCarouselView = require('streamhub-sdk/content/views/product-carousel-view');
var inherits = require('inherits');
var debug = require('debug');

'use strict';

var hasInnerHtmlBug = null;
var log = debug('streamhub-sdk/content/views/content-view');

/**
 * Defines the base class for all content-views. Handles updates to attachments
 * and loading of images.
 *
 * @param opts {Object} The set of options to configure this view with.
 * @param opts.content {Content} The content object to use when rendering.
 * @param opts.el {?HTMLElement} The element to render this object in.
 * @param opts.headerView {View}
 * @param opts.bodyView {View}
 * @param opts.footerView {View}
 * @param opts.attachmentsView {View}
 * @fires ProductContentView#removeProductContentView.hub
 * @exports streamhub-sdk/content/views/content-view
 * @constructor
 */
var ProductContentView = function (opts) {
    opts = opts || {};

    this.content = opts.content;
    this.createdAt = new Date(); // store construction time to use for ordering if this.content has no dates
    this._headerViewFactory = opts.headerViewFactory || new ContentHeaderViewFactory();

    CompositeView.call(this, opts);

    this._addInitialChildViews(opts);

    if (this.content) {
        this.content.on("change:body", function(newVal, oldVal){
            this._handleBodyChange();
        }.bind(this));
    }
};
inherits(ProductContentView, CompositeView);

ProductContentView.prototype.elTag = 'article';
ProductContentView.prototype.elClass = 'content';
ProductContentView.prototype.invalidClass = 'content-invalid';
ProductContentView.prototype.attachmentsElSelector = '.content-attachments';
ProductContentView.prototype.attachmentFrameElSelector = '.content-attachment-frame';

/**
 * @param {Object} opts
 * @param {boolean=} shouldRender
 */
ProductContentView.prototype._addInitialChildViews = function (opts, shouldRender) {
    shouldRender = shouldRender || false;
    this._headerView = opts.headerView || this._headerViewFactory.createHeaderView(opts.content);
    this.add(this._headerView, { render: shouldRender });

    this._bodyView = opts.bodyView || new ContentBodyView(opts);
    this.add(this._bodyView, { render: shouldRender });

    this._footerView = opts.footerView || new ContentFooterView(opts);
    this.add(this._footerView, { render: shouldRender });

    //this._productView = opts.productView || new ProductCarouselView(opts);
    //this.add(this._productView, { render: shouldRender });
};

ProductContentView.prototype._removeInitialChildViews = function () {
    this.remove(this._headerView);
    this.remove(this._bodyView);
    this.remove(this._footerView);
    this.remove(this._productView);
};

/**
 * Set the .el DOMElement that the ProductContentView should render to
 * @param el {DOMElement} The new element the ProductContentView should render to
 * @returns {ProductContentView}
 */
ProductContentView.prototype.setElement = function (el) {
    CompositeView.prototype.setElement.apply(this, arguments);

    if (this.content && this.content.id) {
        this.$el.attr('data-content-id', this.content.id);
    }

    return this;
};

/**
 * Gets the template rendering context. By default, returns "this.content".
 * @returns {Content} The content object this view was instantiated with.
 */
ProductContentView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this.content);
    return context;
};

/**
 * Removes the content view element, and triggers 'removeProductContentView.hub'
 * event for the instance to be removed from its associated ListView.
 */
ProductContentView.prototype.remove = function () {
    /**
     * removeProductContentView.hub
     * @event ProductContentView#removeProductContentView.hub
     * @type {{ProductContentView: ProductContentView}}
     */
    this.$el.trigger('removeProductContentView.hub', { ProductContentView: this });
    this.$el.detach();
};

ProductContentView.prototype._handleBodyChange = function (newVal, oldVal) {
    this._bodyView.render();
};

ProductContentView.prototype.destroy = function () {
    CompositeView.prototype.destroy.call(this);
    this.content = null;
};

/**
 * Render the content inside of the ProductContentView's element.
 * @returns {ProductContentView}
 */
ProductContentView.prototype.render = function () {
    /**
     * bengo:
     * This next 3 lines makes me sad, but it is necessary to support IE9.
     * View.prototype.render will set this.innerHTML to template().
     * For some reason, this also causes the innerHTML of the buttons to
     * be set to an empty string. e.g. Like Buttons have their like count
     * cleared out. When ._renderButtons later re-appendChilds all the
     * button.els, they are empty. So if we detach them here before
     * this.innerHTML is set, they are not cleared.
     * bit.ly/1no8mNk 
     */
    if (hasInnerHtmlBug = this._testHasInnerHtmlBug()) {
        this._footerView._detachButtons();
    }

    CompositeView.prototype.render.call(this);
    return this;
};

ProductContentView.prototype._testHasInnerHtmlBug = function() {
    // only test once
    if (hasInnerHtmlBug !== null) {
        return hasInnerHtmlBug
    }
    var txt = 'hi';
    var parent = document.createElement('div');
    var child = document.createElement('span');
    child.appendChild(document.createTextNode(txt));
    parent.appendChild(child);
    parent.innerHTML = '';
    return child.innerHTML === '';
};

module.exports = ProductContentView;
