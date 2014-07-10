define([
    'streamhub-sdk/content/types/livefyre-content', 'inherits'],
function(LivefyreContent, inherits) {
    'use strict';

    var LivefyreUrlContent = function(json) {
        LivefyreContent.call(this, json);
        var oembed = (json.childContent && json.childContent[0] && json.childContent[0].content.oembed) ? 
            json.childContent[0].content.oembed : null

        if(oembed === null) return;

        this.viaText = oembed.provider_name || oembed.provider_url;
        this.title = oembed.title;

    };
    inherits(LivefyreUrlContent, LivefyreContent);

    LivefyreUrlContent.prototype.typeUrn = 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-url';

    LivefyreUrlContent.prototype.addAttachment = function (oembed) {
        // link attachments are just metadata about this content as a whole.
        // not things that should be rendered in attachmentListViews
        if (oembed && oembed.type === 'link') {
            return;
        }
        return LivefyreContent.prototype.addAttachment.apply(this, arguments);
    }

    return LivefyreUrlContent;
});
