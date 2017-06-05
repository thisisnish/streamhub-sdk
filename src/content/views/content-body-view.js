var $ = require('streamhub-sdk/jquery');
var i18n = require('streamhub-sdk/i18n');
var inherits = require('inherits');
var isBoolean = require('mout/lang/isBoolean');
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
    this._showMoreEnabled = isBoolean(opts.showMoreEnabled) ?
        opts.showMoreEnabled :
        true;
};
inherits(ContentBodyView, View);

ContentBodyView.prototype.events = View.prototype.events.extended({
    'click.content-body-show-more': function(e) {
        e.stopPropagation();
        this.render({showMore:true});
    }
});

ContentBodyView.prototype.template = template;
ContentBodyView.prototype.elTag = 'section';
ContentBodyView.prototype.elClass = 'content-body';
ContentBodyView.prototype.showMoreSelector = '.content-body-show-more';

ContentBodyView.prototype.getTemplateContext = function (opts) {
    var context = $.extend({truncated: false}, this._content);
    var attachments = context.attachments;

    var div = document.createElement('div');
    div.innerHTML = context.body;
    var bodyText = div.innerText;
    var shouldTruncate = !opts || (opts && !opts.showMore);

    if (this._showMoreEnabled && bodyText.length > 125 && shouldTruncate) {
        bodyText = bodyText.slice(0, 124) + '&hellip;';
        context.showMoreText = i18n.get('viewMore', 'View More');
        context.truncated = true;
    }

    context.body = '<p>' + bodyText + '</p>';

    // If there an duplicate link title + content title, then
    // remove the content title for display purposes.
    if (attachments.length && attachments[0].type === 'link') {
        if (context.title === attachments[0].title) {
            context.title = '';
        }
    }

    // Ensure that the title is only text.
    if (context.title) {
        var div = document.createElement('div');
        div.innerHTML = context.title;
        context.title = div.innerText;
    }

    // Add the translated featured string if the content is featured
    if (context.featured) {
        context.featuredText = i18n.get('featuredText', 'Featured');
    }
    return context;
};

/** @override */
ContentBodyView.prototype.render = function (opts) {
    var context;
    if (typeof this.template === 'function') {
        context = this.getTemplateContext(opts);
        this.$el.html(this.template(context));
    }

    if (this._content.title) {
        this.$el.addClass('content-has-title');
    }
};

module.exports = ContentBodyView;
