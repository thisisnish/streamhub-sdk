define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/types/livefyre-feed-content'],
function ($, LivefyreFeedContent) {
    'use strict';

    describe('A livefyre feed object', function () {
        var content = new LivefyreFeedContent({});

        it('has the correct typeUrn', function () {
            expect(content.typeUrn).toBe('urn:livefyre:js:streamhub-sdk:content:types:livefyre-feed');
        });

        describe('#_modifyLinks', function () {
            it('adds target-"_blank" to all anchors', function () {
                content.body = '<p>test <a href="http://vk.cc/5wrXWm">vk.cc/5wrXWm</a> blah</p>';
                content._modifyLinks();
                expect(content.body).toEqual('<p>test <a href="http://vk.cc/5wrXWm" target="_blank">vk.cc/5wrXWm</a> blah</p>');
            });
        });
    });
});
