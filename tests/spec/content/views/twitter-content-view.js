define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/views/twitter-content-view',
    'json!streamhub-sdk-tests/fixtures/verified-tweet-state.json',
    'json!streamhub-sdk-tests/fixtures/unverified-tweet-state.json'],
function ($, LivefyreTwitterContent, TwitterContentView, verifiedTweetState, unverifiedTweetState) {
    'use strict';

    describe('A TwitterContentView object', function () {
        it('has a verified user indication if the content author is a verified twitter user', function () {
            var content = new LivefyreTwitterContent(verifiedTweetState);
            var contentView = new TwitterContentView({ content: content });
            contentView.render();
            expect(contentView.$('.content-author-verified').length).toBe(1);
        });
        it('does not have a verified user indication if the content author is not a verified twitter user', function () {
            var content = new LivefyreTwitterContent(unverifiedTweetState);
            var contentView = new TwitterContentView({ content: content });
            contentView.render();
            expect(contentView.$('.content-author-verified').length).toBe(0);
        });
    });
});
