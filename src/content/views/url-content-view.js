var inherits = require('inherits');
var View = require('streamhub-sdk/view');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var asUrlContentView = require('streamhub-sdk/content/views/mixins/url-content-view-mixin');

'use strict';

var UrlContentView = function (opts) {
    //opts.footerView = new View();
    LivefyreContentView.call(this, opts);
    asUrlContentView(this, opts);
};
inherits(UrlContentView, LivefyreContentView);

module.exports = UrlContentView;
