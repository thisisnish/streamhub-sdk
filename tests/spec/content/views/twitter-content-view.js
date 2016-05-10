define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/content-view-factory',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/views/twitter-content-view',
    'json!streamhub-sdk-tests/fixtures/verified-tweet-state.json',
    'json!streamhub-sdk-tests/fixtures/unverified-tweet-state.json'],
function ($, ContentViewFactory, LivefyreTwitterContent, TwitterContentView, verifiedTweetState, unverifiedTweetState) {
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
        it('has a source logo that links to twitter.com homepage (twitter display requirement...)', function () {
            var content = new LivefyreTwitterContent(unverifiedTweetState);
            var contentView = new TwitterContentView({ content: content });
            contentView.render();
            expect(contentView.$('.content-source-logo').attr('href')).toBe('https://twitter.com');
        });
    });

    describe('Expand button', function () {
        it("renders only if showExpandButton is set to true", function () {
            var contentViewFactory = new ContentViewFactory({showExpandButton: true});
            var content = new LivefyreTwitterContent(verifiedTweetState);
            var twitterContentView = contentViewFactory.createContentView(content);
            twitterContentView.render();
            expect(twitterContentView.$el.find('.hub-content-action-expand')).toHaveLength(1);
        });
        it("does not render if showExpandButton is not set", function () {
            var contentViewFactory = new ContentViewFactory();
            var contentViewFactory1 = new ContentViewFactory({showExpandButton: false});
            var content = new LivefyreTwitterContent(verifiedTweetState);
            var twitterContentView = contentViewFactory.createContentView(content);
            twitterContentView.render();
            var twitterContentView1 = contentViewFactory1.createContentView(content);
            twitterContentView1.render();
            expect(twitterContentView.$el.find('.hub-content-action-expand')).toHaveLength(0);
            expect(twitterContentView1.$el.find('.hub-content-action-expand')).toHaveLength(0);
        });
    });
});
