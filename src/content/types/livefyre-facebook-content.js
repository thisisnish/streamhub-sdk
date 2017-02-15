define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/types/livefyre-content',
    'inherits'
], function($, LivefyreContent, inherits) {
    'use strict';

    /**
     * Represents a piece of Livefyre's content curated from Facebook.
     * @param json {Object} An object obtained via a Livefyre stream that represents the
     *        state of the content.
     * @exports streamhub-sdk/content/types/livefyre-facebook-content
     * @constructor
     */
    var LivefyreFacebookContent = function (json) {
        var bodyEl;

        LivefyreContent.call(this, json);

        // There may be times when Facebook content is just a string with no HTML.
        // Sizzle may throw an error, so wrap any parsing to avoid these errors.
        try {
            var div = document.createElement('div');
            div.innerHTML = this.body;
            bodyEl = $(div);
        } catch(e) {
            // This will happen a lot. Pass
        }

        if (bodyEl && bodyEl.length) {
            bodyEl.find('.fyre-image, .fyre-link').remove();
            this.body = bodyEl.html();
        }
    };
    inherits(LivefyreFacebookContent, LivefyreContent);

    LivefyreFacebookContent.prototype.typeUrn = 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-facebook';

    return LivefyreFacebookContent;
});
