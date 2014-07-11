define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/types/livefyre-url-content',
    'streamhub-sdk/content/views/url-content-view',
    'json!streamhub-sdk-tests/fixtures/url-type-content.json'],
function ($, LivefyreUrlContent, UrlContentView, urlTypeContent) {
    'use strict';

    describe('A UrlContentView object', function () {
        it('has title if the oembed provides one', function () {
            /*var content = new LivefyreUrlContent(otherTypeUrl);
            var contentView = new UrlContentView({ content: content });
            contentView.render();
            expect(contentView.$('.content-body-title').length).toBe(1);*/
        });
    });
});
