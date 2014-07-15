define([
    'streamhub-sdk/content/types/livefyre-content', 'inherits'],
function(LivefyreContent, inherits) {
    'use strict';

    var LivefyreUrlContent = function(json) {
        LivefyreContent.call(this, json);
        var oembed = (json.childContent && json.childContent[0] && json.childContent[0].content.oembed) ? 
            json.childContent[0].content.oembed : null;
        var generator = json.content.generator || null;

        if(oembed !== null) {
            this.title = oembed.title;
        }

        if(generator !== null){
            this.urlContentTypeId = generator.id;
            this.viaText = generator.displayName || generator.id || generator.url;
            this.favicon = generator.image;
        }

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
