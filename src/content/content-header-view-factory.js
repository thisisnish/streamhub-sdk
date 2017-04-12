var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var TYPE_URNS = require('streamhub-sdk/content/types/type-urns');

'use strict';

/**
 * Object which knows how to create the appropriate ContentHeaderView
 * for different Content Types.
 * Specifically, Facebook, Twitter, and the rest have different display
 * requirements.
 */
function ContentHeaderViewFactory() {};

ContentHeaderViewFactory.prototype.createHeaderView = function (content) {
    return new ContentHeaderView(this.getHeaderViewOptsForContent(content));
};

/**
 * Providers that support created at urls, as long as they match the regex.
 * @const {Object}
 */
var SUPPORTED_PERMALINK_PROVIDERS = {
    facebook: /^https?:\/\/(www\.)?facebook\.com/,
    instagram: /^https?:\/\/(www\.)?instagram\.com/
};

/**
 * Generates the URL that is linked from the created at copy on the content.
 * @param {string} provider The provider type for this content.
 * @param {Object} content The content to generate the URL from.
 * @return {string=}
 * @private
 */
ContentHeaderViewFactory.prototype._getContentPermalink = function (provider, content) {
    if (provider === 'twitter') {
        return 'https://twitter.com/statuses/' + content.tweetId;
    }

    var attachments = content && content.attachments || [];
    if (!attachments.length) {
        return;
    }

    var attachment = attachments[0];
    var attachmentProvider = (attachment.provider_name || '').toLowerCase();
    var regex = SUPPORTED_PERMALINK_PROVIDERS[attachmentProvider];
    if (regex && regex.test(attachment.link)) {
        return attachment.link;
    }
};

ContentHeaderViewFactory.prototype.getHeaderViewOptsForContent = function (content) {
    var opts = {};
    opts.author =  content.author;

    // It's possible that the displayName is empty or it's just not set.
    // If that is the case, try to fill it with either the handle or the
    // last part of the profileUrl.
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
        if (content.author && typeof content.author.profileUrl === 'string') {
            opts.authorUserNamePrefix = '@';
            opts.authorUserName = content.author.handle;
            opts.authorUrl = content.author.profileUrl;
        }
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

    opts.createdAt = content.createdAt;
    opts.createdAtUrl = this._getContentPermalink(opts.contentSourceName, content);
    return opts;
};

module.exports = ContentHeaderViewFactory;
