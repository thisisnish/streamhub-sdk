var inherits = require('inherits');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var hasTheme = require('streamhub-sdk/content/views/mixins/theme-mixin');

/**
 * A Concrete class used as the default ContentView in the SDK
 * It has the .content-default theme automatically applied
 */
var FeedContentView = function (opts) {
    opts = opts || {};
    LivefyreContentView.call(this, opts);
    hasTheme(this, 'content-feed');
};
inherits(FeedContentView, LivefyreContentView);

module.exports = FeedContentView;
