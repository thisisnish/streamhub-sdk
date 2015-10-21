define([
    'streamhub-sdk/content/types/livefyre-url-content',
    'inherits'
], function(LivefyreUrlContent, inherits) {
    'use strict';

    function LivefyreYoutubeContent(json) {
        json.content = Object.create(json.content);
        json.content.generator = {
            url: "https://www.youtube.com/",
            displayName: "YouTube",
            id: "www.youtube.com"
        };
        LivefyreUrlContent.call(this, json);
    }
    inherits(LivefyreYoutubeContent, LivefyreUrlContent);

    return LivefyreYoutubeContent;
});
