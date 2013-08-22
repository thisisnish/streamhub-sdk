define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/view',
    'streamhub-sdk/content/views/attachment-list-view',
    'streamhub-sdk/content/views/oembed-view',
    'hgn!streamhub-sdk/content/templates/gallery-attachment-list',
    'hgn!streamhub-sdk/content/templates/content-byline',
    'streamhub-sdk/util'],
function($, View, AttachmentListView, OembedView, GalleryAttachmentListTemplate, ContentBylineTemplate, util) {

    var GalleryAttachmentListView = function(opts) {
        opts = opts || {};

        this.content = opts.content;
        if (opts.toFocus) {
            this._focusedOembedView = opts.toFocus.el ? opts.toFocus : new OembedView({ oembed: opts.toFocus });
        }
        this.tile = false;
        this.pageButtons = opts.pageButtons || true;
        this.pageCount = opts.pageCount || true;
        this.thumbnails = opts.thumbnails || false;
        this.focusedIndex = 0;
        this.oembedViews = [];

        View.call(this, opts);

        if (this.content) {
            for (var i=0; i < this.content.attachments.length; i++) {
                this.add(this.content.attachments[i]);
            }
        }
    };
    util.inherits(GalleryAttachmentListView, View);
    $.extend(GalleryAttachmentListView.prototype, AttachmentListView.prototype);

    GalleryAttachmentListView.prototype.template = GalleryAttachmentListTemplate;
    GalleryAttachmentListView.prototype.attachmentsGallerySelector = '.content-attachments-gallery';
    GalleryAttachmentListView.prototype.focusedAttachmentsSelector = '.content-attachments-gallery-focused';
    GalleryAttachmentListView.prototype.galleryThumbnailsSelector = '.content-attachments-gallery-thumbnails';
    GalleryAttachmentListView.prototype.galleryPrevSelector = '.content-attachments-gallery-prev';
    GalleryAttachmentListView.prototype.galleryNextSelector = '.content-attachments-gallery-next';
    GalleryAttachmentListView.prototype.galleryCloseSelector = '.content-attachments-gallery-close';
    GalleryAttachmentListView.prototype.galleryCurrentPageSelector = '.content-attachments-gallery-current-page';
    GalleryAttachmentListView.prototype.galleryTotalPagesSelector = '.content-attachments-gallery-total-pages';
    GalleryAttachmentListView.prototype.focusedAttachmentClassName = 'content-attachments-focused';
    GalleryAttachmentListView.prototype.attachmentMetaSelector = '.content-attachments-meta';
    GalleryAttachmentListView.prototype.actualImageSelector = '.content-attachment-actual-image';

    GalleryAttachmentListView.prototype.initialize = function() {
        var self = this;
        if (this.content) {
            this.content.on('attachment', function(attachment) {
                self.add(attachment);
                self.render();
            });
        }

        this.$el.on('focusContent.hub', function(e, context) {
            if (context.content) {
                for (var i=0; i < context.content.attachments; i++) {
                    self.add(context.content.attachments[i]);
                }
            }
            self._focusedOembedView = context.focusedAttachmentView;
            self.render();
        });

        $(window).on('resize', function(e) {
            self.resizeFocusedAttachment();
        });

        this.$el.on(
            'click',
            [this.attachmentMetaSelector, this.galleryNextSelector, this.galleryPrevSelector, this.actualImageSelector].join(','),
            function(e) {
                e.stopPropagation();
            }
        );
    };

    GalleryAttachmentListView.prototype.render = function() {
        var attachmentsGalleryEl = this.$el.find(this.attachmentsGallerySelector);
        var focusedAttachmentsEl = this.$el.find(this.focusedAttachmentsSelector);
        focusedAttachmentsEl.empty();

        var galleryOembedViews = [];
        for (var i=0; i < this.oembedViews.length; i++) {
            if (!this.isAttachmentTileable(this.oembedViews[i])) {
                continue;
            }

            var oembedView = new OembedView({
                oembed: this.oembedViews[i].oembed
            });

            if (oembedView.oembed == this._focusedOembedView.oembed) {
                this._focusedOembedView = oembedView;
            }
            galleryOembedViews.push(oembedView);
        }

        // Render gallery thumbnails
        attachmentsGalleryEl.find(this.galleryThumbnailsSelector).empty();
        var self = this;
        $(galleryOembedViews).each(function(i, oembedView) {
            oembedView.$el.on('click', function(e) {
                $(e.target).trigger('focusContent.hub', self.content, oembedView);
            });
            oembedView.render();
            oembedView.$el.appendTo(attachmentsGalleryEl.find(self.galleryThumbnailsSelector));
        });

        var attachmentsCount = this.tileableCount();
        var thumbnailsEl = attachmentsGalleryEl.find(this.galleryThumbnailsSelector);
        if (this.tile) {
            thumbnailsEl.removeClass('content-attachments-1')
                .removeClass('content-attachments-2')
                .removeClass('content-attachments-3')
                .removeClass('content-attachments-4');
            thumbnailsEl.addClass('content-attachments-'+attachmentsCount);
            if (attachmentsCount == 1 || attachmentsCount == 2) {
                thumbnailsEl.find('.content-attachment').addClass(this.horizontalTileClassName);
                thumbnailsEl.find('.content-attachment:first')
                    .removeClass(this.horizontalTileClassName)
                    .addClass(this.squareTileClassName);
            } else {
                thumbnailsEl.find('.content-attachment').addClass(this.squareTileClassName);
            }
        }

        // Render focused oembed view
        this._focusedOembedView = this._focusedOembedView || this.oembedViews[0];
        if (this._focusedOembedView) {
            this._focusedOembedView.render();
            var focusedEl = this._focusedOembedView.$el.clone();
            focusedEl.appendTo(focusedAttachmentsEl);
            var photoContentEl = focusedEl.find('.content-attachment-photo');
            photoContentEl.addClass(this.focusedAttachmentClassName);
            if (this.tile) {
                focusedEl.find('.content-attachment').addClass(this.squareTileClassName);
            }
            if (this._focusedOembedView.oembed.type === 'video') {
                var playButtonEl = focusedEl.find('.content-attachment-controls-play');
                playButtonEl.hide();
                photoContentEl.hide().removeClass(this.focusedAttachmentClassName);
                var videoContentEl = focusedEl.find('.content-attachment-video');
                videoContentEl.addClass(this.focusedAttachmentClassName);
                videoContentEl.html(this._focusedOembedView.oembed.html);
                if (this.tile) {
                    videoContentEl.find('iframe').css({'width': '100%', 'height': '100%'});
                }
                videoContentEl.show();
            }
        }

        // Update page count
        if (this.pageCount) {
            for (var i=0; i < this.oembedViews.length; i++) {
                if (this.oembedViews[i].oembed == this._focusedOembedView.oembed) {
                    this.focusedIndex = i;
                    break;
                }
            }
            this.$el.find(this.galleryCurrentPageSelector).html(this.focusedIndex + 1);
            this.$el.find(this.galleryTotalPagesSelector).html(attachmentsCount);
        }

        // Meta
        var contentMetaEl = this.$el.find(this.attachmentMetaSelector);
        contentMetaEl.append(ContentBylineTemplate(this.content));

        // Update gallery size
        var focusedAttachmentEl = this.$el.find('.'+this.focusedAttachmentClassName + '> *')
        if (!focusedAttachmentEl.length) {
            return;
        }
        if (focusedAttachmentEl[0].tagName == 'IMG') {
            focusedAttachmentEl.on('load', function(e) {
                self.resizeFocusedAttachment();
            });
        } else {
            this.resizeFocusedAttachment();
        }
    };

    GalleryAttachmentListView.prototype.resizeFocusedAttachment = function() {
        var height = this.$el.height();
        var width = this.$el.width();

        var contentGalleryEl = this.$el.find('.content-attachments-gallery');
        var modalVerticalWhitespace = parseInt(contentGalleryEl.css('margin-top')) + parseInt(contentGalleryEl.css('margin-bottom'));
        var modalHorizontalWhitespace = parseInt(contentGalleryEl.css('margin-left')) + parseInt(contentGalleryEl.css('margin-right'));

        var attachmentContainerHeight = height - modalVerticalWhitespace;
        var attachmentContainerWidth = width - modalHorizontalWhitespace;
        contentGalleryEl.height(attachmentContainerHeight);
        contentGalleryEl.width(attachmentContainerWidth);

        var contentAttachmentEl = this.$el.find('.content-attachments-gallery-focused .content-attachment');
        contentAttachmentEl.css({ 'height': attachmentContainerHeight+'px', 'line-height': attachmentContainerHeight+'px'});

        var focusedAttachmentEl = this.$el.find('.'+this.focusedAttachmentClassName + '> *');
        // Reset attachment dimensions
        if (focusedAttachmentEl.attr('width')) {
            focusedAttachmentEl.css({ 'width': parseInt(focusedAttachmentEl.attr('width'))+'px' });
        } else {
            focusedAttachmentEl.css({ 'width': 'auto'});
        }
        if (focusedAttachmentEl.attr('height')) {
            focusedAttachmentEl.css({ 'height': parseInt(focusedAttachmentEl.attr('height'))+'px' });
        } else {
            focusedAttachmentEl.css({ 'height': 'auto', 'line-height': 'inherits'});
        }

        // Scale to fit testing against modal dimensions
        if (focusedAttachmentEl.height() + modalVerticalWhitespace >= height || focusedAttachmentEl.height() == 0) {
            focusedAttachmentEl.css({ 'height': attachmentContainerHeight+'px', 'line-height': attachmentContainerHeight+'px'});
            if (focusedAttachmentEl.attr('width')) {
                var newWidth = Math.min(parseInt(focusedAttachmentEl.attr('width')), focusedAttachmentEl.width());
                focusedAttachmentEl.css({ 'width': newWidth+'px' });
            } else {
                focusedAttachmentEl.css({ 'width': 'auto' });
            }
        } 
        if (focusedAttachmentEl.width() + modalHorizontalWhitespace >= width || focusedAttachmentEl.width() == 0) {
            focusedAttachmentEl.css({ 'width': attachmentContainerWidth+'px'});
            if (focusedAttachmentEl.attr('height')) {
                var newHeight = Math.min(parseInt(focusedAttachmentEl.attr('height')), focusedAttachmentEl.height()); 
                focusedAttachmentEl.css({ 'height': newHeight+'px' });
            } else {
                focusedAttachmentEl.css({ 'height': 'auto', 'line-height': 'inherits'});
            }
        }
    };

    /**
     * Add a Oembed attachment to the Attachments view. 
     * @param oembed {Oembed} A Oembed instance to render in the View
     * @returns {AttachmentListView} By convention, return this instance for chaining
     */
    GalleryAttachmentListView.prototype.add = function(oembed) { 
        var oembedView = this.createOembedView(oembed);
        oembedView.render();
        this.render();

        return this;
    };

    return GalleryAttachmentListView;
});
 
