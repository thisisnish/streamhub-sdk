define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/content/types/livefyre-opine',
    'hgn!streamhub-sdk/content/templates/content',
    'streamhub-sdk/util',
    'inherits',
    'streamhub-sdk/debug'
], function ($, ContentView, LivefyreOpine, ContentTemplate, util, inherits, debug) {
    'use strict';

    /**
     * Defines the base class for all content-views. Handles updates to attachments
     * and loading of images.
     *
     * @param opts {Object} The set of options to configure this view with.
     * @param opts.content {Content} The content object to use when rendering. 
     * @param opts.el {?HTMLElement} The element to render this object in.
     * @param opts.shareCommand {streamhub-sdk/ui/command} Command to use
     *     for share button. If not present or cannot execute, no share button
     * @fires LivefyreContentView#removeContentView.hub
     * @exports streamhub-sdk/content/views/content-view
     * @constructor
     */
    var LivefyreContentView = function LivefyreContentView (opts) {
        opts = opts || {};

        this._themeClass = opts.themeClass || 'content-default';
        this.elClass += this._themeClass;

        ContentView.call(this, opts);
    };
    inherits(LivefyreContentView, ContentView);

    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    LivefyreContentView.prototype.render = function () {
        ContentView.prototype.render.call(this);
        return this;
    };

    LivefyreContentView.prototype._updateLikeCount = function () {
        this._likeButton.updateLabel(this.content.getLikeCount().toString());
    };

    /**
     * Add a button to this ContentView.
     * This will re-render the buttons
     * @param button {Button} Button to add
     * @param [opts] {object}
     * @param [opts.side='left'] {'right'|'left'} Which side of the footer to add
     *     the button to
     */
    LivefyreContentView.prototype.addButton = function (button, opts) {
        this._footerView.addButton(button, opts);
    };

    /**
     * Remove a Button from the ContentView
     * @param button {Button} Button to remove
     */
    LivefyreContentView.prototype.removeButton = function (button) {
        this._footerView.removeButton(button);
    };

    return LivefyreContentView;
});
