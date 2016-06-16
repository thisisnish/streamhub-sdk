var inherits = require('inherits');
var FeedContentView = require('streamhub-sdk/content/views/feed-content-view');
var hasTheme = require('streamhub-sdk/content/views/mixins/theme-mixin');

/**
 * A Concrete class used as the default ContentView in the SDK
 * It has the .content-default theme automatically applied
 */
var TumblrContentView = function (opts) {
    opts = opts || {};
    FeedContentView.call(this, opts);
    hasTheme(this, 'content-tumblr');
};
inherits(TumblrContentView, FeedContentView);

module.exports = TumblrContentView;
