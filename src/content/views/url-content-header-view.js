var inherits = require('inherits');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var asUrlContentHeaderView = require('streamhub-sdk/content/views/mixins/url-content-view-mixin');
var template = require('hgn!streamhub-sdk/content/templates/url-content-header');

'use strict';

/**
 * A view for rendering instagram content into an element.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/instagram-content-view
 * @constructor
 */
var UrlContentHeaderView = function (opts) {
    ContentHeaderView.call(this, opts);

    this.template = template;
    this.displayName = opts.content.author.displayName;
    this.displayNameLink = opts.content.author.profileUrl;
    this.viaText = opts.content.viaText;

    asUrlContentHeaderView(this, opts);
};
inherits(UrlContentHeaderView, ContentHeaderView);

module.exports = UrlContentHeaderView;