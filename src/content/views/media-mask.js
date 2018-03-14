'use strict';

var $ = require('jquery');
var inherits = require('inherits');
var View = require('streamhub-sdk/view');

/**
 * Media mask that shows over media thumbnails for Do Not Track enabled browsers.
 * @constructor
 * @extends {View}
 * @param {Object} opts
 */
function MediaMask(opts) {
    View.call(this, opts);

    /**
     * Whether the mask should be shown or not.
     * @type {boolean}
     * @private
     */
    this._showMask = true;
}
inherits(MediaMask, View);

MediaMask.prototype.containerSelector = '.media-mask-container';
MediaMask.prototype.elClass = 'media-mask';
MediaMask.prototype.events = {'click .show-embed': 'onClick'};
MediaMask.prototype.showBtnSelector = '.show-embed';
MediaMask.prototype.template = require('hgn!streamhub-sdk/content/templates/media-mask');

/**
 * Supported oembed types that should be masked.
 * @const {Array}
 */
var SUPPORTED_TYPES = ['video'];

/**
 * Handle the click event on the entire element. If an anchor was clicked,
 * don't allow the event to bubble, because that will cause the mask to be
 * removed.
 * @param {Event} evt
 */
MediaMask.prototype.onClick = function (evt) {
    this.opts.oembed.viewed = true;
    this._showMask = false;
    this.render();
    this.opts.callback && this.opts.callback();
};

/** @override */
MediaMask.prototype.render = function () {
    // Don't show the media mask if the oembed type isn't supported or if the
    // oembed provider is whitelisted.
    if (!this._showMask) {
        this.$el.hide();
        return this;
    }

    View.prototype.render.call(this);

    // If the DNT delegate function is provided, replace the default content
    // with the new content. This supports string responses (wrapped in a
    // paragraph) and DOM responses.
    if (typeof this.opts.delegate === 'function') {
        var dom = this.opts.delegate();
        if (typeof dom === 'string') {
            dom = !$(dom).length ? $('<p />').html(dom) : $(dom);
        }
        this.$el.find(this.containerSelector + ' > *').not(this.showBtnSelector).remove();
        this.$el.find(this.containerSelector).prepend(dom);
    }
    return this;
};

/**
 * Whether or not the mask should be shown.
 * @param {Object} oembed
 * @param {boolean} canShow
 * @return {boolean}
 */
MediaMask.shouldShowMask = function (oembed, canShow) {
    var supportsMask = SUPPORTED_TYPES.indexOf(oembed.type) > -1;
    var providerName = (oembed.provider_name || '').toLowerCase();
    var videoSrc = oembed.html;

    if (!canShow || !supportsMask || oembed.viewed) {
        return false;
    }
    if (providerName === 'twitter' && videoSrc.indexOf('twimg.com') > -1) {
        return false;
    }
    if (providerName === 'livefyre' && videoSrc.indexOf('cloudfront.net') > -1) {
        return false;
    }
    return true;
};

module.exports = MediaMask;