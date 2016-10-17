var inherits = require('inherits');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var template = require('hgn!streamhub-sdk/content/templates/url-content-header');

'use strict';

/**
 * A view for rendering Livefyre URL content header.
 * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
 * @exports streamhub-sdk/content/views/url-content-header-view
 * @constructor
 */
var UrlContentHeaderView = function (opts) {
    ContentHeaderView.call(this, opts);
    var content = opts.content;
    this.template = template;
    this.displayName = content.author.displayName;
    this.displayNameLink = content.author.profileUrl;
    this.viaText = content.viaText;
    this.favicon = content.favicon;
    this.contentSourceUrl = content.attachments && content.attachments.length ? content.attachments[0].url : undefined;
    this.contentSourceName = this.contentSourceName ? this.contentSourceName : content.viaText;
};
inherits(UrlContentHeaderView, ContentHeaderView);

module.exports = UrlContentHeaderView;
