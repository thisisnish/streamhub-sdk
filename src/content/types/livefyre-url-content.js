define([
    'streamhub-sdk/content/types/livefyre-content', 'inherits'],
function(LivefyreContent, inherits) {
    'use strict';

    var LivefyreUrlContent = function(json) {
        LivefyreContent.call(this, json);
    };
    inherits(LivefyreInstagramContent, LivefyreContent);

    LivefyreUrlContent.prototype.typeUrn = 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-url';

    return LivefyreUrlContent;
});
