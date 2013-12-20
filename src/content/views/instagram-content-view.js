define([
    'streamhub-sdk/content/views/content-view',
    'hgn!streamhub-sdk/content/templates/instagram',
    'inherits'],
function (ContentView, InstagramContentTemplate, inherits) {
    'use strict';
    
    /**
     * A view for rendering instagram content into an element.
     * @param opts {Object} The set of options to configure this view with (See ContentView).
     * @exports streamhub-sdk/content/views/instagram-content-view
     * @constructor
     */

    var InstagramContentView = function (opts) {
        ContentView.call(this, opts);
    };
    inherits(InstagramContentView, ContentView);
    
    InstagramContentView.prototype.elClass += ' content-instagram ';
    InstagramContentView.prototype.template = InstagramContentTemplate;

    InstagramContentView.prototype.events = ContentView.prototype.events.extended({
        'imageError.hub': function (e, oembed) {
            this.remove();
        }
    });

    return InstagramContentView;
});
