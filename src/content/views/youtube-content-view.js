var inherits = require('inherits');
var FeedContentView = require('streamhub-sdk/content/views/feed-content-view');
var hasTheme = require('streamhub-sdk/content/views/mixins/theme-mixin');

/**
 * A Concrete class used as the default ContentView in the SDK
 * It has the .content-default theme automatically applied
 */
var YoutubeContentView = function (opts) {
    opts = opts || {};
    FeedContentView.call(this, opts);
    hasTheme(this, 'content-youtube');
};
inherits(YoutubeContentView, FeedContentView);

module.exports = YoutubeContentView;
