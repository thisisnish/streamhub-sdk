var inherits = require('inherits');
var CardContentView = require('streamhub-sdk/content/views/card-content-view');
var asTwitterContentView = require('streamhub-sdk/content/views/mixins/twitter-content-view-mixin');

'use strict';

/**
 * A view for rendering twitter content into an element.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/twitter-content-view
 * @constructor
 */
var TwitterContentView = function (opts) {
    opts = opts || {};
    this.content = opts.content;

    CardContentView.apply(this, arguments);
    asTwitterContentView(this, opts);
};
inherits(TwitterContentView, CardContentView);

module.exports = TwitterContentView;
