define([
    'streamhub-sdk/content/types/livefyre-content',
    'inherits'
], function(LivefyreContent, inherits) {
    'use strict';

    function LivefyreFeedContent(json) {
        LivefyreContent.call(this, json);
    }
    inherits(LivefyreFeedContent, LivefyreContent);

    LivefyreFeedContent.prototype.typeUrn = 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-feed';

    return LivefyreFeedContent;
});