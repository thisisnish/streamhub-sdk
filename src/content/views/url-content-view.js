var inherits = require('inherits');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var asUrlContentView = require('streamhub-sdk/content/views/mixins/url-content-view-mixin');
var UrlContentHeaderView = require('streamhub-sdk/content/views/url-content-header-view');

'use strict';

var UrlContentView = function (opts) {
    opts.headerView = new UrlContentHeaderView(opts);

    LivefyreContentView.call(this, opts);
    asUrlContentView(this, opts);
};
inherits(UrlContentView, LivefyreContentView);

module.exports = UrlContentView;
