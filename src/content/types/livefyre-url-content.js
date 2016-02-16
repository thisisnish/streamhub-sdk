'use strict';

var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var inherits = require('inherits');

module.exports = LivefyreUrlContent;

function LivefyreUrlContent(json) {
    LivefyreContent.call(this, json);

    this.title = this._setAttr('title', json);
    this.feedUrl = this._setAttr('url', json);
    var generator = json.content.generator || null;

    if (generator !== null) {
        this.urlContentTypeId = generator.id;
        this.viaText = generator.displayName || generator.id || generator.url;
        this.favicon = generator.image;
    }
};
inherits(LivefyreUrlContent, LivefyreContent);

LivefyreUrlContent.prototype.typeUrn = 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-url';

LivefyreUrlContent.prototype.addAttachment = function (oembed) {
    if (oembed) {
        var type = oembed.type || null;
        var provider = oembed.provider_name ? oembed.provider_name.toLowerCase() : null; 

        this.title = this._setAttr('title', oembed);
        this.feedUrl = this._setAttr('url', oembed);

        //Don't attach links or facebook rich embeds
        if (type === 'link' || (type === 'rich' && provider === "facebook")) {
            return;
        }
    }
    return LivefyreContent.prototype.addAttachment.apply(this, arguments);
}

LivefyreUrlContent.prototype._setAttr = function (attr, json) {
    // Don't change the value.
    if (this[attr]) {
        return this[attr];
    }

    var oembed;
    if (json[attr]) {
        oembed = json;
    } else if (json.childContent) {
        oembed = (json.childContent[0] && json.childContent[0].content.oembed) ?
            json.childContent[0].content.oembed : null;
    } else if (json.content.attachments) {
        oembed = json.content.attachments[0];
    }

    // Don't change the value.
    if (! oembed || ! shouldHaveAttr(attr, oembed)) {
        return this[attr];
    }

    return oembed[attr];
};

function shouldHaveAttr(attr, oembed) {
    if (! oembed[attr]) {
        return false;
    }
    var provider = oembed.provider_name ? oembed.provider_name.toLowerCase() : null;
    // dont have title if this is a known source url link
    return ['twitter', 'facebook', 'instagram'].indexOf(provider) === -1;
}
