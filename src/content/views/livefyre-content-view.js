var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var debug = require('streamhub-sdk/debug');
var auth = require('auth');
var Command = require('streamhub-sdk/ui/command');
var HubButton  = require('streamhub-sdk/ui/hub-button');
var HubLikeButton = require('streamhub-sdk/ui/hub-like-button');
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var CardContentView = require('streamhub-sdk/content/views/card-content-view');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');

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
var LivefyreContentView = function (opts) {
    this.template = opts.template;


    this._themeClass = opts.themeClass || 'content-default';
    this.elClass += this._themeClass;

    CardContentView.apply(this, arguments);
    asLivefyreContentView(this);

    this._addInitialButtons();
};
inherits(LivefyreContentView, CardContentView);

/**
 * Render the content inside of the LivefyreContentView's element.
 * @returns {LivefyreContentView}
 */
LivefyreContentView.prototype.render = function () {
    /**
     * bengo:
     * This next 3 lines makes me sad, but it is necessary to support IE9.
     * View.prototype.render will set this.innerHTML to template().
     * For some reason, this also causes the innerHTML of the buttons to
     * be set to an empty string. e.g. Like Buttons have their like count
     * cleared out. When ._renderButtons later re-appendChilds all the
     * button.els, they are empty. So if we detach them here before
     * this.innerHTML is set, they are not cleared.
     * bit.ly/1no8mNk 
     */
    if (getIeVersion() === 9) {
        this._footerView._detachButtons();
    }
    CardContentView.prototype.render.call(this);
    return this;
};

    // return the ie version if IE, else false
    function getIeVersion () {
        var myNav = navigator.userAgent.toLowerCase();
        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
    }

LivefyreContentView.prototype._addInitialButtons = function () {
    return;
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

module.exports = LivefyreContentView;
