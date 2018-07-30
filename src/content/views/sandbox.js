var inherits = require('inherits');
var template = require('hgn!streamhub-sdk/content/templates/sandbox');
var View = require('streamhub-sdk/view');

'use strict';

var id = 0;
function getId() {
  id++;
  return id;
}

/**
 * Sandbox iframe that media can be loaded within.
 * @constructor
 * @extends {View}
 * @param {Object} opts 
 */
function Sandbox(opts) {
    View.call(this, opts);
    this.embed = opts.embed;
    this.id = getId();
}
inherits(Sandbox, View);

var MAX_WIDTH = 658;

/**
 * Sandbox iframe src.
 * @const {string}
 */
var SANDBOX_SRC = 'https://cdn.livefyre.com/libs/sandbox/v1.2.4/sandbox.html';

/** @enum {string} */
Sandbox.CLASSES = {
    IFRAME: 'content-sandbox'
};

/** @override */
Sandbox.prototype.destroy = function () {
    View.prototype.destroy.call(this);
    window.removeEventListener('message', this.onMessage.bind(this), false);
};

/** @return {Object} */
Sandbox.prototype.getTemplateContext = function () {
    return {
        src: SANDBOX_SRC + '?id=' + this.id,
        height: this.embed.height,
        width: this.embed.width
    };
};

/**
 * Inject html into the sandbox iframe.
 */
Sandbox.prototype.injectHtml = function () {
    this.iframe.contentWindow.postMessage({
        type: 'inject',
        html: this.embed.html + '\n<script async defer src=\"//www.instagram.com/embed.js\"></script>',
        mediaType: 'rich',
        provider: this.embed.provider_name
    }, '*');
};

/**
 * Handle message from iframe.
 * @param {Event} evt 
 */
Sandbox.prototype.onMessage = function (evt) {
    // Prevent multiple instances on the page from injecting incorrect data.
    if (this.id !== evt.data.id) {
        return;
    }

    switch (evt.data.type) {
        case 'ready':
            this.injectHtml();
            break;
        case 'loaded':
            this.$el.trigger('sandboxLoaded');
            break;
        case 'size':
            this.iframe.height = evt.data.height;
            this.$el.trigger('modalSize.hub', {height: this.iframe.height});
            break;
        default:
            // pass
    }
};

/** @override */
Sandbox.prototype.render = function () {
    this.$el.html(template(this.getTemplateContext()));
    this.iframe = this.$el.find('.' + Sandbox.CLASSES.IFRAME)[0];
    window.addEventListener('message', this.onMessage.bind(this), false);
    return this;
};

Sandbox.prototype.resize = function (width) {
    var width = this.iframe.parentElement.clientWidth;
    this.iframe.width = width;
    this.iframe.contentWindow.postMessage({type: 'resize', width: width}, '*');
};

module.exports = Sandbox;
