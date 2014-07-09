var inherits = require('inherits');
var ContentView = require('streamhub-sdk/content/views/content-view');
var asCardContentView = require('streamhub-sdk/content/views/mixins/card-content-view-mixin');

/**
 * A Concrete class used as the default ContentView in the SDK
 * It has the .content-default theme automatically applied
 */
var CardContentView = function (opts) {
    opts = opts || {};
    ContentView.call(this, opts);
    asCardContentView(this);
};
inherits(CardContentView, ContentView);

module.exports = CardContentView;
