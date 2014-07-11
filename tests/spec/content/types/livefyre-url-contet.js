define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/types/livefyre-url-content',
    'json!streamhub-sdk-tests/fixtures/url-type-content.json'],
function ($, LivefyreUrlContent, urlTypeContent) {
    'use strict';

    describe('A LivefyreUrlContent object', function () {
        it('has .viaText if oembed has a provider name or url', function () {
            var content = new LivefyreUrlContent(urlTypeContent);
            expect(typeof content.viaText !== "undefined").toBe(true);
        });
        it('has .title if oembed has one', function () {
            var content = new LivefyreUrlContent(urlTypeContent);
            expect(typeof content.title !== "undefined").toBe(true);
        });
    });
});
