var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var FacebookContentHeaderView = require('streamhub-sdk/content/views/facebook-content-header-view');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');
var asFacebookContentView = require('streamhub-sdk/content/views/mixins/facebook-content-view-mixin');

'use strict';

/**
 * A view for rendering facebook content into an element.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/facebook-content-view
 * @constructor
 */
var FacebookContentView = function FacebookContentView (opts) {
    opts = opts || {};
    opts.headerView = new FacebookContentHeaderView(opts);
    LivefyreContentView.apply(this, arguments);

    asLivefyreContentView(this);
    asFacebookContentView(this);
};
inherits(FacebookContentView, LivefyreContentView);

FacebookContentView.prototype.elClass += ' content-facebook ';

module.exports = FacebookContentView;
