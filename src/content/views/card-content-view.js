var inherits = require('inherits');
var ContentView = require('streamhub-sdk/content/views/content-view');
var asCardContentView = require('streamhub-sdk/content/views/mixins/card-content-view-mixin');

var CardContentView = function (opts) {
    opts = opts || {};
    ContentView.call(this, opts);
    asCardContentView(this);
};
inherits(CardContentView, ContentView);

module.exports = CardContentView;
