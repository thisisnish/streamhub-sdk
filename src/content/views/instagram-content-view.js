define([
    'streamhub-sdk/content/views/livefyre-content-view',
    'streamhub-sdk/ui/button',
    'inherits'],
function (LivefyreContentView, Button, inherits) {
    'use strict';
    
    /**
     * A view for rendering instagram content into an element.
     * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
     * @exports streamhub-sdk/content/views/instagram-content-view
     * @constructor
     */

    var InstagramContentView = function (opts) {
        LivefyreContentView.call(this, opts);
    };
    inherits(InstagramContentView, LivefyreContentView);
    
    InstagramContentView.prototype.elClass += ' content-instagram ';

    InstagramContentView.prototype.events = LivefyreContentView.prototype.events.extended({
        'imageError.hub': function (e, oembed) {
            this.remove();
        }
    });

    return InstagramContentView;
});
