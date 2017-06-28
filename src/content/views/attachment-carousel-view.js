var $ = require('streamhub-sdk/jquery');
var CompositeView = require('view/composite-view');
var CarouselAttachmentListView = require('streamhub-sdk/content/views/carousel-attachment-list-view');
var SingleAttachmentView = require('streamhub-sdk/content/views/single-attachment-view');
var inherits = require('inherits');

'use strict';

/**
 * A version of the tiled attachement list view that only shows a single image
 * @param opts {Object} A set of options to config the view with
 * @param opts.el {HTMLElement} The element in which to render the streamed content
 * @param opts.content {Content} The content instance with which to display its attachments
 * @param opts.carouselElementWidth {Number} Should be the total width of styled AttachmentListView elements.
 * Used to calculate amount to shift per navigation.
 * @fires TiledAttachmentListView#focusContent.hub
 * @exports streamhub-sdk/views/AttachmentCarouselView
 * @constructor
 */
var AttachmentCarouselView = function (opts) {
    opts = opts || {};
    opts.carouselElementWidth = opts.carouselElementWidth || 90;
    CompositeView.call(this, opts);
    this._addInitialChildViews(opts);
};
inherits(AttachmentCarouselView, CompositeView);

AttachmentCarouselView.prototype.elTag = 'div';
AttachmentCarouselView.prototype.elClass = 'attachment-carousel';
AttachmentCarouselView.prototype.hideClass = 'hide';
AttachmentCarouselView.prototype.listClass = '.content-attachments-stacked';
AttachmentCarouselView.prototype.attachmentSelector = '.' +
    CarouselAttachmentListView.prototype.elClass + ' ' +
    CarouselAttachmentListView.prototype.contentAttachmentSelector;
AttachmentCarouselView.prototype.leftSelector = '.attachment-carousel-left-arrow';
AttachmentCarouselView.prototype.rightSelector = '.attachment-carousel-right-arrow';
AttachmentCarouselView.prototype.stackedAttachmentsSelector = '.' +
    CarouselAttachmentListView.prototype.elClass + ' ' +
    CarouselAttachmentListView.prototype.stackedAttachmentsSelector;

AttachmentCarouselView.prototype.events = CompositeView.prototype.events.extended({}, function (events) {
    events['click ' + this.attachmentSelector] = this._onThumbnailClick.bind(this);
    events['click ' + this.leftSelector] = this._onCarouselNavigate.bind(this, false);
    events['click ' + this.rightSelector] = this._onCarouselNavigate.bind(this, true);
});

AttachmentCarouselView.prototype._onThumbnailClick = function (e) {
    var index = $(this.attachmentSelector).index(e.currentTarget);
    this._singleAttachmentView.retile(index);
    this._insertVideo(this._singleAttachmentView.oembedViews[index]);
};

AttachmentCarouselView.prototype._insertVideo = function (oembedView) {
    if (!oembedView) {
        return;
    }
    var focusedEl = oembedView.$el;
    if (oembedView.oembed.type === 'video') {
        var photoContentEl = focusedEl.find('.content-attachment-photo');
        setTimeout(function() { photoContentEl.hide(); }, 0);
        var videoContentEl = focusedEl.find('.content-attachment-video');
        videoContentEl.html(this._getAttachmentVideoHtml(oembedView.oembed));
        var videoIframe = videoContentEl.find('iframe');
        videoIframe.css({'width': '100%', 'height': '100%'});

        // Add poster if missing
        var videoEl = videoContentEl.find('video');
        if (videoEl.length > 0) {
            videoEl.attr('poster', oembedView.oembed.thumbnail_url);
            videoEl.css({'width': '100%', 'height': '100%'});
        }

        videoContentEl.show();
    }
};

AttachmentCarouselView.prototype._getAttachmentVideoHtml = function (attachment) {
    var AUTOPLAY_PROVIDER_REGEX = /youtube|livefyre|facebook/;
    // If the provider is not available for autoplay, nothing more to do.
    if (!attachment.provider_name || !AUTOPLAY_PROVIDER_REGEX.test(attachment.provider_name.toLowerCase())) {
        return attachment.html;
    }

    var $html = $(attachment.html);
    var iframe = $html[0].tagName === 'IFRAME' ? $html[0] : $html.find('iframe')[0];
    var video = $html[0].tagName === 'VIDEO' ? $html[0] : $html.find('video')[0];

    if (video) {
        video.setAttribute('autoplay', true);
        return video.outerHTML;
    }

    if (iframe) {
        var queryChar = iframe.src.indexOf('?') > -1 ? '&' : '?';
        iframe.src += queryChar + 'autoplay=1';

        // make youtube videos not show related videos
        var srcIndex = iframe.src.indexOf('src=');
        var youtubeIndex = iframe.src.indexOf('youtube', srcIndex);
        var nextAmpersand = iframe.src.indexOf('&', srcIndex);
        // youtube is in the source
        if (youtubeIndex < nextAmpersand && srcIndex > -1 && nextAmpersand > -1) {
            iframe.src = iframe.src.substring(0, nextAmpersand) + '%26rel%3D0' + iframe.src.substring(nextAmpersand);
        }

        return $('<div>').append($html).html();
    }

    return attachment.html;
};

AttachmentCarouselView.prototype._onCarouselNavigate = function (right, e) {
    e.stopPropagation();

    var leftSelector = this.$el.find(this.leftSelector);
    var rightSelector = this.$el.find(this.rightSelector);

    var direction = right ? -1 : 1;
    var listEl = this.$el.find(this.stackedAttachmentsSelector);
    // Update the left position of the thumbnail carousel in the direction of
    // the arrow that was pressed.
    listEl.offset({left: listEl.offset().left + (direction * this.opts.carouselElementWidth)});

    // Remove the hide class from the arrow in the opposite direction since
    // there is at least one thumbnail in that direction.
    (right ? leftSelector : rightSelector).removeClass(this.hideClass);

    // Get the current left position that has been shifted so far. This will be
    // used to determine whether we can hide arrows or not.
    var leftPos = parseInt(listEl.css('left').split('px'), 10) || 0;

    // We are back to the original left position of 0, so we can hide the left
    // arrow since there aren't any more thumbnails to see.
    if (leftPos >= 0) {
        leftSelector.addClass(this.hideClass);
        return;
    }

    var listWidth = listEl.width();
    var visibleWidth = listEl.parent().width();
    // If the visible portion of the carousel + amount that has been shifted is
    // greater than the width of the entire carousel, there are no more
    // thumbnails to the right.
    if (listWidth <= (visibleWidth + Math.abs(leftPos))) {
        rightSelector.addClass(this.hideClass);
    }
};

/**
 * @param {Object} opts
 * @param {boolean=} shouldRender
 */
AttachmentCarouselView.prototype._addInitialChildViews = function (opts, shouldRender) {
    var renderOpts = {render: !!shouldRender};

    this._singleAttachmentView = opts.singleAttachmentView || new SingleAttachmentView(opts);
    this.add(this._singleAttachmentView, renderOpts);

    if (this._singleAttachmentView.tileableCount() > 1) {
        this._attachmentsListView = opts.attachmentsListView || new CarouselAttachmentListView(opts);
        this.add(this._attachmentsListView, renderOpts);
    }
};

AttachmentCarouselView.prototype.add = function (view) {
    this._childViews.push(view);
    return this;
};

AttachmentCarouselView.prototype.render = function (view, opts) {
    CompositeView.prototype.render.call(this);

    this.$el.find(this.leftSelector).addClass(this.hideClass);
    this._insertVideo(this._singleAttachmentView.oembedViews[0]);
    this._jsPositioning();
    return this;
};

AttachmentCarouselView.prototype._jsPositioning = function () {
    if (!this._attachmentsListView) {
        return;
    }
    this._attachmentsListView.$el
        .find(this._attachmentsListView.stackedAttachmentsSelector)
        .width(this.opts.carouselElementWidth * this._attachmentsListView.count());
};

AttachmentCarouselView.prototype.getTemplateContext = function () {
    return $.extend({}, this.opts);
};

module.exports = AttachmentCarouselView;
