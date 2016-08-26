define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/types/livefyre-content',
    'inherits'
], function($, LivefyreContent, inherits) {
    'use strict';

    function LivefyreFeedContent(json) {
        LivefyreContent.call(this, json);
        this._modifyLinks();
    }
    inherits(LivefyreFeedContent, LivefyreContent);

    LivefyreFeedContent.prototype.typeUrn = 'urn:livefyre:js:streamhub-sdk:content:types:livefyre-feed';

    /**
     * Modify all links in the body and add target="_blank" so that it doesn't
     * open in the same window. This is an RSS problem since we're given the
     * body directly from the feed, which doesn't have the target attribute.
     * @private
     */
    LivefyreFeedContent.prototype._modifyLinks = function () {
        var div = $('<div></div>').html(this.body);
        div.find('a').each(function () {
            $(this).attr('target', '_blank');
        });
        this.body = div.html();
    };

    return LivefyreFeedContent;
});
