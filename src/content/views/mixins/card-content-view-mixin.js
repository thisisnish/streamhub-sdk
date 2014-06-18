var hasTheme = require('streamhub-sdk/content/views/mixins/theme-mixin');

'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have default card theme
 */
function asCardContentView(contentView) {
    hasTheme('content-default', contentView);
};

module.exports = asCardContentView;
