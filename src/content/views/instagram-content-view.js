var inherits = require('inherits');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var Button = require('streamhub-sdk/ui/button');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');
var asInstagramContentView = require('streamhub-sdk/content/views/mixins/instagram-content-view-mixin');

'use strict';

/**
 * A view for rendering instagram content into an element.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/instagram-content-view
 * @constructor
 */
var InstagramContentView = function (opts) {
    LivefyreContentView.call(this, opts);

    asLivefyreContentView(this);
    asInstagramContentView(this);
};
inherits(InstagramContentView, LivefyreContentView);

InstagramContentView.prototype.elClass += ' content-instagram ';

module.exports = InstagramContentView;
