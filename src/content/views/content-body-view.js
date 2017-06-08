var $ = require('streamhub-sdk/jquery');
var i18n = require('streamhub-sdk/i18n');
var inherits = require('inherits');
var isBoolean = require('mout/lang/isBoolean');
var JsTruncateHtml = require('js-truncate-html');
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

    /**
     * Whether the body truncation feature is enabled or not.
     * @type {boolean}
     * @private
     */
    this._showMoreEnabled = isBoolean(opts.showMoreEnabled) ?
        opts.showMoreEnabled :
        false;

    /**
     * Whether the body is truncatable or not.
     * @type {boolean}
     * @private
     */
    this._isBodyTruncatable = false;

    /**
     * Whether the body is currently truncated or not.
     * @type {boolean}
     * @private
     */
    this._truncated = this._showMoreEnabled;

    /**
     * HTML truncater. This is used to truncate the body without losing html
     * elements within it.
     * @type {JsTruncateHtml}
     * @private
     */
    this._truncator = new JsTruncateHtml({
        includeElipsis: true,
        elipsisLength: 1,
        elipsisCharacter: '&hellip;'
    });
};
inherits(ContentBodyView, View);

ContentBodyView.prototype.events = View.prototype.events.extended({
    'click .content-body-show-more': function (e) {
        e.stopPropagation();
        this._truncated = !this._truncated;
        this.render();
    }
});

ContentBodyView.prototype.template = template;
ContentBodyView.prototype.elTag = 'section';
ContentBodyView.prototype.elClass = 'content-body';
ContentBodyView.prototype.showMoreSelector = '.content-body-show-more';

ContentBodyView.prototype.getTemplateContext = function () {
    var context = $.extend({}, this._content);
    var attachments = context.attachments;
    var body = context.bodyOrig || context.body;

    if (this._showMoreEnabled) {
        var div = document.createElement('div');
        div.innerHTML = body;
        var bodyText = div.innerText;
        this._isBodyTruncatable = bodyText.length > 125;

        if (this._isBodyTruncatable && this._truncated) {
            // Ensure that the body is wrapped in paragraphs before truncating
            // so that we can pull them off and truncate.
            if (!/^<p/.test(body)) {
                body = '<p>' + $.trim(body) + '</p>';
            }
            context.body = body = this._truncator.truncate($(body).html(), 124);
        }
    }

    if (!/^<p/.test($.trim(body))) {
        context.body = '<p>' + $.trim(body) + '</p>';
    }

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
ContentBodyView.prototype.render = function () {
    View.prototype.render.call(this);

    if (this._content.title) {
        this.$el.addClass('content-has-title');
    }

    if (!this._showMoreEnabled || !this._isBodyTruncatable) {
        return this;
    }

    var showMore = document.createElement('a');
    $(showMore).addClass('content-body-show-more')
        .toggleClass('view-more', this._truncated)
        .toggleClass('view-less', !this._truncated)
        .html(this._truncated ?
            i18n.get('viewMore', 'View More') :
            i18n.get('viewLess', 'View Less'));
    this.$el.find('.content-body-main p:last-child').append(showMore);
    return this;
};

module.exports = ContentBodyView;
