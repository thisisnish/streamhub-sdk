var hasTheme = require('streamhub-sdk/content/views/mixins/theme-mixin');

'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have default card theme
 */
function asWeiboContentView(contentView) {
    hasTheme(contentView, 'content-weibo');
};

module.exports = asWeiboContentView;
