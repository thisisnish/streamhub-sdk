var $ = require('streamhub-sdk/jquery');
var auth = require('auth');
var inherits = require('inherits');
var View = require('streamhub-sdk/view');
var HubButton = require('streamhub-sdk/ui/hub-button');
var HubLikeButton = require('streamhub-sdk/ui/hub-like-button');
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var template = require('hgn!streamhub-sdk/content/templates/content-footer');
var util = require('streamhub-sdk/util');

'use strict';

/**
 * A view that displays a content item's footer.
 * Includes content buttons and timestamp
 * @param opts {Object} A set of options to config the view with
 * @param opts.el {HTMLElement} The element in which to render the streamed content
 * @param opts.content {Content} The content instance with which to display its footer
 * @exports streamhub-sdk/views/content-footer-view
 * @constructor
 */
var ContentFooterView = function (opts) {
    opts = opts || {};
    View.call(this, opts);

    this._content = opts.content;
    this._controls = {
        'left': [],
        'right': []
    };

    this._commands = {};
    this._setCommand({
        like: opts.likeCommand,
        share: opts.shareCommand
    });
    if (opts.template) {
        this.template = opts.template;
    }

    this._addInitialButtons();
};
inherits(ContentFooterView, View);

ContentFooterView.prototype.template = template;
ContentFooterView.prototype.elTag = 'section';
ContentFooterView.prototype.elClass = 'content-footer';

ContentFooterView.prototype.formatDate = util.formatDate;

ContentFooterView.prototype.footerLeftSelector = '.content-footer-left > .content-control-list';
ContentFooterView.prototype.footerRightSelector = '.content-footer-right > .content-control-list';

/**
 * Set the a command for a buton
 * This should only be called once.
 * @private
 */
ContentFooterView.prototype._setCommand = function (cmds) {
    for (var name in cmds) {
        if (cmds.hasOwnProperty(name)) {
            if (! cmds[name]) {
                continue;
            }
            this._commands[name] = cmds[name];

            // If canExecute changes, re-render buttons because now maybe the button should appear
            cmds[name].on('change:canExecute', this._renderButtons.bind(this));
        }
    }
};

/**
 * Create and add any buttons that should be on all ContentFooterViews.
 * This will be invoked on construction
 * They will be rendered by ._renderButtons later.
 */
ContentFooterView.prototype._addInitialButtons = function () {
    // Like
    this._likeButton = this._createLikeButton();
    if (this._likeButton) {
        this.addButton(this._likeButton);
    }
    // Share
    this._shareButton = this._createShareButton();
    if (this._shareButton) {
        this.addButton(this._shareButton);
    }
};

/**
 * Create a Button to be used for Liking functionality
 * @protected
 */
ContentFooterView.prototype._createLikeButton = function () {
    // Don't render a button when no auth delegate
    if ( ! auth.hasDelegate('login')) {
        return;
    }
    // Don't render a button if this isn't actually LivefyreContent
    if (this._content.typeUrn !== LivefyreContent.prototype.typeUrn) {
        return;
    }
    return new HubLikeButton(this._commands.like, {
        content: this._content
    });
};

/**
 * Create a Share Button
 * @protected
 */
ContentFooterView.prototype._createShareButton = function () {
    var shareCommand = this._commands.share;
    if ( ! (shareCommand && shareCommand.canExecute())) {
        return;
    }
    var shareButton = new HubButton(shareCommand, {
        className: 'btn-link content-share',
        label: 'Share'
    });
    return shareButton;
};

ContentFooterView.prototype.render = function () {
    View.prototype.render.call(this);
    this._renderButtons();
};

/**
 * Clear out the current control list,
 * and render all the buttons that have been added
 */
ContentFooterView.prototype._renderButtons = function () {
    var $leftControls = this.$el.find(this.footerLeftSelector);
    var $rightControls = this.$el.find(this.footerRightSelector);

    $leftControls.html('');
    this._controls.left.forEach(function (button) {
        // In case event handler is unbound by jQuery's html() method: http://stackoverflow.com/a/9227033
        // call setElement to ensure event handlers are bound
        button.setElement(button.el);
        $leftControls.append(button.$el);
    });

    $rightControls.html('');
    this._controls.right.forEach(function (button) {
        // In case event handler is unbound by jQuery's html() method: http://stackoverflow.com/a/9227033
        // call setElement to ensure event handlers are bound
        button.setElement(button.el);
        $rightControls.append(button.$el);
    });
};

/**
 * Add a button to this ContentView.
 * This will re-render the buttons
 * @param button {Button} Button to add
 * @param [opts] {object}
 * @param [opts.side='left'] {'right'|'left'} Which side of the footer to add
 *     the button to
 */
ContentFooterView.prototype.addButton = function (button, opts) {
    opts = opts || {};
    var footerControls;
    var footerSide;
    if (opts.side === 'right') {
        footerControls = this._controls.right;
        footerSide = this.$el.find(this.footerRightSelector);
    } else {
        footerControls = this._controls.left;
        footerSide = this.$el.find(this.footerLeftSelector);
    }

    // Don't add the same button twice
    if (footerControls.indexOf(button) !== -1) {
        return;
    }

    footerControls.push(button);
    var buttonContainerEl = $('<div></div>');
    button.setElement(buttonContainerEl);
    button.render();

    // If the footer is rendered, then re-render all buttons.
    // If buttons are added before the ContentView is, then we shouldn't
    // render buttons
    if (footerSide.length) {
        this._renderButtons();
    }
};


/**
 * Remove a Button from the ContentView
 * @param button {Button} Button to remove
 */
ContentFooterView.prototype.removeButton = function (button) {
    this._controls.left.splice(this._controls.left.indexOf(button), 1);
    this._controls.right.splice(this._controls.right.indexOf(button), 1);

    button.destroy();
};

ContentFooterView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this._content);
    if (this._content && this._content.createdAt) {
        context.formattedCreatedAt = this.formatDate(this._content.createdAt);
    }

    return context;
};

module.exports = ContentFooterView;
