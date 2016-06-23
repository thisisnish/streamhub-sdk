var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var asWeiboContentView = require('streamhub-sdk/content/views/mixins/weibo-content-view-mixin');

'use strict';

/**
 * A view for rendering weibo content into an element.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/weibo-content-view
 * @constructor
 */
var WeiboContentView = function WeiboContentView (opts) {
    opts = opts || {};
    LivefyreContentView.apply(this, arguments);

    asWeiboContentView(this, opts);
};
inherits(WeiboContentView, LivefyreContentView);

module.exports = WeiboContentView;
