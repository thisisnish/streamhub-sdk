define([
    'streamhub-sdk/content/types/livefyre-content',
    'inherits'
], function(LivefyreContent, inherits) {
    'use strict';

    function LivefyreWeiboContent(json) {
        LivefyreContent.call(this, json);
    }
    inherits(LivefyreWeiboContent, LivefyreContent);

    LivefyreWeiboContent.prototype.typeUrn = 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-weibo';

    return LivefyreWeiboContent;
});
