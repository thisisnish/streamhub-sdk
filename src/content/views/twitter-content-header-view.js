var inherits = require('inherits');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');

'use strict';

var TwitterContentHeaderView = function (opts) {
    ContentHeaderView.call(this, opts);
};
inherits(TwitterContentHeaderView, ContentHeaderView);

TwitterContentHeaderView.prototype.getTemplateContext = function () {
    var context = ContentHeaderView.prototype.getTemplateContext.call(this);

    if (context && context.author && typeof context.author.profileUrl === 'string') {
        context.author.twitterUsername = context.author.profileUrl.split('/').pop();
    }
    if (context.author) {
        context.authorUrl = '//twitter.com/intent/user?user_id='+context.author.twitterUserId;
        context.authorUserName = context.author.twitterUsername;
        context.authorUserNamePrefix = '@';
    }

    context.authorVerified = this._content.twitterVerified;

    context.contentSourceName = 'twitter';
    context.contentSourceTooltipUrl = '//twitter.com';
    context.contentSourceTooltipText = 'View on Twitter';

    context.createdAtUrl = context.contentSourceTooltipUrl;

    return context;
};

module.exports = TwitterContentHeaderView;
