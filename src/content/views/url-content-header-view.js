var inherits = require('inherits');
var ContentHeaderView = require('streamhub-sdk/content/views/livefyre-content-view');
var asUrlContentHeaderView = require('streamhub-sdk/content/views/mixins/url-content-view-mixin');

'use strict';

/**
 * A view for rendering instagram content into an element.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/instagram-content-view
 * @constructor
 */
var UrlContentHeaderView = function (opts) {
    ContentHeaderView.call(this, opts);
    asUrlContentHeaderView(this, opts);
};
inherits(UrlContentHeaderView, ContentHeaderView);

module.exports = UrlContentHeaderView;