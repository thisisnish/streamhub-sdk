var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var TYPE_URNS = require('streamhub-sdk/content/types/type-urns');

'use strict';

/**
 * Object which knows how to create the appropriate ContentHeaderView
 * for different Content Types.
 * Specifically, Facebook, Twitter, and the rest have different display
 * requirements.
 */
var ContentHeaderViewFactory = function (opts) {
    opts = opts || {};
};

ContentHeaderViewFactory.prototype.createHeaderView = function (content) {
    var opts = this._getHeaderViewOptsForContent(content);
    return new ContentHeaderView(opts);
};

ContentHeaderViewFactory.prototype._getHeaderViewOptsForContent = function (content) {
    var opts = {};
    opts.author =  content.author;

    if (content.author && !content.author.displayName) {
        if (content.author.handle) {
            opts.author.displayName = content.author.handle;
        } else if (typeof content.author.profileUrl === 'string') {
            opts.author.displayName = content.author.profileUrl.split('/').pop();
        }
    }

    if (content.typeUrn === TYPE_URNS.LIVEFYRE_TWITTER || content.typeUrn === TYPE_URNS.TWITTER) {
        if (content.author && typeof content.author.profileUrl === 'string') {
            opts.authorUserNamePrefix = '@';
            opts.authorUserName = content.author.profileUrl.split('/').pop();
            opts.authorUrl = 'https://twitter.com/intent/user?user_id=' + content.author.twitterUserId;
        }
        opts.authorVerified = content.twitterVerified;
        opts.contentSourceName = 'twitter';
        opts.contentSourceUrl = 'https://twitter.com';
        opts.contentSourceTooltipText = 'View on Twitter';
    } else if (content.typeUrn === TYPE_URNS.LIVEFYRE_FACEBOOK) {
        if (content.author) {
            opts.authorUrl = content.author.profileUrl;
        }
        opts.contentSourceName = 'facebook'
        opts.contentSourceUrl = 'https://facebook.com';
        opts.contentSourceTooltipText = 'View on Facebook';
    } else if (content.typeUrn === TYPE_URNS.LIVEFYRE_INSTAGRAM) {
        opts.contentSourceName = 'instagram';
        opts.contentSourceUrl = 'https://instagram.com';
        opts.contentSourceTooltipText = 'View on Instagram';
    } else if (content.typeUrn === TYPE_URNS.LIVEFYRE_WEIBO) {
        opts.contentSourceName = 'weibo';
        opts.contentSourceUrl = 'http://weibo.com/';
        opts.contentSourceTooltipText = 'View on Weibo';
    } else if (content.typeUrn === TYPE_URNS.LIVEFYRE_YOUTUBE) {
        opts.contentSourceName = 'youtube';
        opts.contentSourceUrl = 'https://youtube.com';
        opts.contentSourceTooltipText = 'View on YouTube';
    } else if (content.typeUrn === TYPE_URNS.LIVEFYRE_FEED) {
        opts.contentSourceName = 'rss';
    } else if (content.typeUrn === TYPE_URNS.LIVEFYRE) {
        opts.contentSourceName = 'livefyre';
    }

    return opts;
};

module.exports = ContentHeaderViewFactory;
