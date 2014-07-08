var inherits = require('inherits');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var Button = require('streamhub-sdk/ui/button');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');
var asUrlContentView = require('streamhub-sdk/content/views/mixins/url-content-view-mixin');

'use strict';

/**
 * A view for rendering instagram content into an element.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/instagram-content-view
 * @constructor
 */
var UrlContentView = function (opts) {
    LivefyreContentView.call(this, opts);
    asUrlContentView(this, opts);
};
inherits(UrlContentView, LivefyreContentView);

module.exports = UrlContentView;
