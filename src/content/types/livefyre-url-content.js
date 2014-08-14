'use strict';

var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var inherits = require('inherits');

module.exports = LivefyreUrlContent;

function LivefyreUrlContent(json) {
    LivefyreContent.call(this, json);
    var oembed = (json.childContent && json.childContent[0] && json.childContent[0].content.oembed) ? 
        json.childContent[0].content.oembed : null;
    var generator = json.content.generator || null;

    if(oembed && shouldHaveTitle(oembed)) {
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
    if(oembed){
        var type = oembed.type || null;
        var provider = oembed.provider_name ? oembed.provider_name.toLowerCase() : null; 

        //Don't attach links or facebook rich embeds
        if (oembed.type === 'link' || (type === 'rich' && provider === "facebook")){
            return;
        }
    }
    return LivefyreContent.prototype.addAttachment.apply(this, arguments);
}

function shouldHaveTitle(oembed) {
    var provider = oembed.provider_name ? oembed.provider_name.toLowerCase() : null;
    // dont have title if this is a known source url link
    return ['twitter', 'facebook', 'instagram'].indexOf(provider) === -1;
}