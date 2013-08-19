define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/view',
    'streamhub-sdk/content/views/attachment-list-view',
    'streamhub-sdk/content/views/oembed-view',
    'hgn!streamhub-sdk/content/templates/gallery-attachment-list',
    'streamhub-sdk/util'],
function($, View, AttachmentListView, OembedView, GalleryAttachmentListTemplate, util) {

    var GalleryAttachmentListView = function(opts) {
        opts = opts || {};

        this.content = opts.content;
        if (opts.toFocus) {
            this._focusedOembedView = opts.toFocus.el ? opts.toFocus : new OembedView({ oembed: opts.toFocus });
        }
        this.pageButtons = opts.pageButtons || true;
        this.pageCount = opts.pageCount || true;
        this.thumbnails = opts.thumbnails || false;
        this.focusedIndex = 0;

        this.oembedViews = [];
        if (opts.oembedViews) {
            for (var i=0; i < opts.oembedViews.length; i++) {
                this.add(opts.oembedViews[i].oembed);
            }
        }

        View.call(this, opts);

        var self = this;
        this.$el.on('focusAttachment.hub', function(e, focusedAttachment, attachmentViews) {
            if (attachmentViews) {
                self.oembedViews = attachmentViews;
            }
            self.focusedOembedView = focusedAttachment;
            self.render();
        });
    };
    util.inherits(GalleryAttachmentListView, View);
    $.extend(GalleryAttachmentListView.prototype, AttachmentListView.prototype);

    GalleryAttachmentListView.prototype.template = GalleryAttachmentListTemplate;
    GalleryAttachmentListView.prototype.attachmentsGallerySelector = '.content-attachments-gallery';
    GalleryAttachmentListView.prototype.focusedAttachmentsSelector = '.content-attachments-gallery-focused';
    GalleryAttachmentListView.prototype.galleryThumbnailsSelector = '.content-attachments-gallery-thumbnails';

    GalleryAttachmentListView.prototype.initialize = function() {
        var self = this;
        if (this.content) {
            this.content.on('attachment', function(attachment) {
                self.add(attachment);
                self.render();
            });
        }
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
                $(e.target).trigger('focusAttachment.hub', oembedView.oembed);
            });
            oembedView.render();
            oembedView.$el.appendTo(attachmentsGalleryEl.find(self.galleryThumbnailsSelector));
        });

        var attachmentsCount = this.tileableCount();
        var thumbnailsEl = attachmentsGalleryEl.find(this.galleryThumbnailsSelector);
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

        // Render focused oembed view
        this._focusedOembedView = this._focusedOembedView || this.oembedViews[0];
        if (this._focusedOembedView) {
            this._focusedOembedView.render();
            var focusedEl = this._focusedOembedView.$el.clone();
            focusedEl.appendTo(focusedAttachmentsEl)
                .find('.content-attachment').addClass(this.squareTileClassName);
            if (this._focusedOembedView.oembed.type === 'video') {
                var playButtonEl = focusedEl.find('.content-attachment-controls-play');
                playButtonEl.hide();
                focusedEl.find('.content-attachment-photo').hide();
                var videoContentEl = focusedEl.find('.content-attachment-video');
                videoContentEl.html(this._focusedOembedView.oembed.html);
                videoContentEl.find('iframe').css({'width': '100%', 'height': '100%'});
                videoContentEl.show();
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
 
