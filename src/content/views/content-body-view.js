var $ = require('streamhub-sdk/jquery');
var i18n = require('streamhub-sdk/i18n');
var inherits = require('inherits');
var template = require('hgn!streamhub-sdk/content/templates/content-body');
var View = require('streamhub-sdk/view');

'use strict';

/**
 * A view that displays a content item's body
 * @param opts {Object} A set of options to config the view with
 * @param opts.el {HTMLElement} The element in which to render the streamed content
 * @param opts.content {Content} The content instance with which to display its body
 * @exports streamhub-sdk/views/content-body-view
 * @constructor
 */
var ContentBodyView = function (opts) {
    opts = opts || {};
    View.call(this, opts);

    this._content = opts.content;
};
inherits(ContentBodyView, View);

ContentBodyView.prototype.template = template;
ContentBodyView.prototype.elTag = 'section';
ContentBodyView.prototype.elClass = 'content-body';

ContentBodyView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this._content);
    // Ensure that content.body has a p tag
    var isHtml = /^\s*<(p|div)/;
    if ( ! isHtml.test(context.body)) {
        context.body = '<p>'+context.body+'</p>';
    }
    // Add the translated featured string if the content is featured
    if (context.featured) {
        context.featuredText = i18n.get('featuredText', 'Featured');
    }
    return context;
};

module.exports = ContentBodyView;
