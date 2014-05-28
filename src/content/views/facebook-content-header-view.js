var inherits = require('inherits');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');

'use strict';

var FacebookContentHeaderView = function (opts) {
    ContentHeaderView.call(this, opts);
};
inherits(FacebookContentHeaderView, ContentHeaderView);

FacebookContentHeaderView.prototype.getTemplateContext = function () {
    var context = ContentHeaderView.prototype.getTemplateContext.call(this);

    if (context.attachments.length) {
        context.permalink = context.attachments[0].url;
    }
    
    context.authorUrl = context.author.profileUrl;

    context.contentSourceName = 'facebook';
    context.contentSourceTooltipUrl = context.permalink;
    context.contentSourceTooltipText = 'View on Facebook';

    context.createdAtUrl = context.permalink;

    return context;
};

module.exports = FacebookContentHeaderView;
