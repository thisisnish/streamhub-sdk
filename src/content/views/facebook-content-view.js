define([
    'streamhub-sdk/content/views/livefyre-content-view',
    'streamhub-sdk/content/views/facebook-content-header-view',
    'inherits',
    'streamhub-sdk/jquery'],
function (LivefyreContentView, FacebookContentHeaderView, inherits, $) {
    'use strict';

    /**
     * A view for rendering facebook content into an element.
     * @param opts {Object} The set of options to configure this view with (See LivefyreContentView).
     * @exports streamhub-sdk/content/views/facebook-content-view
     * @constructor
     */
    var FacebookContentView = function FacebookContentView (opts) {
        opts = opts || {};
        opts.headerView = new FacebookContentHeaderView(opts);
        LivefyreContentView.call(this, opts);
    };
    inherits(FacebookContentView, LivefyreContentView);
    
    FacebookContentView.prototype.elClass += ' content-facebook ';
    
    return FacebookContentView;
});
