var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var LivefyreContentView = require('streamhub-sdk/content/views/livefyre-content-view');
var TwitterContentHeaderView = require('streamhub-sdk/content/views/twitter-content-header-view');
var HubButton = require('streamhub-sdk/ui/hub-button');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');
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
    opts.headerView = new TwitterContentHeaderView(opts);
    LivefyreContentView.apply(this, arguments);

    asLivefyreContentView(this);
    asTwitterContentView(this);
};
inherits(TwitterContentView, LivefyreContentView);

TwitterContentView.prototype.elClass += ' content-tweet ';

/**
 * Create and add any buttons that should be on all TwitterContentViews.
 * This will be invoked on construction
 * They will be rendered by ._renderButtons later.
 */
TwitterContentView.prototype._addInitialButtons = function () {
    var replyButton = new HubButton(undefined, {
        className: 'content-action content-action-reply',
        buttonUrl: 'https://twitter.com/intent/tweet?in_reply_to=' + this.content.tweetId
    });
    var retweetButton = new HubButton(undefined, {
        className: 'content-action content-action-retweet',
        buttonUrl: 'https://twitter.com/intent/retweet?tweet_id=' + this.content.tweetId
    });
    var favoriteButton = new HubButton(undefined, {
        className: 'content-action content-action-favorite',
        buttonUrl: 'https://twitter.com/intent/favorite?tweet_id=' + this.content.tweetId
    });

    this.addButton(replyButton);
    this.addButton(retweetButton);
    this.addButton(favoriteButton);
};

module.exports = TwitterContentView;
