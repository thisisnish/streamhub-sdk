define([
    'streamhub-sdk/modal',
    'streamhub-sdk/content/views/gallery-attachment-list-view',
    'streamhub-ui/util/user-agent',
    'inherits'
], function(ModalView, GalleryAttachmentListView, util, inherits) {
    'use strict';

    /**
     * A view that overlays over the entire viewport to display some content
     *
     * @param opts {Object} A set of options to config the view with
     * @fires AttachmentGalleryModal#hideModal.hub
     * @exports streamhub-sdk/modal/views/attachment-gallery-modal
     * @constructor
     */
    var AttachmentGalleryModal = function (opts) {
        ModalView.call(this, opts);

        /**
         * Whether the browser is mobile or not.
         * @type {boolean}
         * @private
         */
        this._isMobile = util.isMobile();
    };
    inherits(AttachmentGalleryModal, ModalView);

    /**
     * Set the element for the view to render in.
     * ModalView construction takes care of creating its own element in
     *     ModalView.el. You probably don't want to call this manually
     * @private
     * @param element {HTMLElement} The element to render this View in
     * @returns this
     */
    AttachmentGalleryModal.prototype.setElement = function (element) {
        ModalView.prototype.setElement.call(this, element);

        var self = this;
        this.$el.on('galleryResize.hub', function (e, aspectRatio) {
            self.resizeFocusedAttachment(aspectRatio);
        });
        return this;
    };

    /**
     * Resizes the focused attachment according to the viewport size.
     * @param {number} aspectRatio
     */
    AttachmentGalleryModal.prototype.resizeFocusedAttachment = function (aspectRatio) {
        var height = this.$el.height();
        var width = this.$el.width();

        var contentGalleryEl = this.$el.find(GalleryAttachmentListView.prototype.attachmentsGallerySelector);
        var modalVerticalWhitespace = parseInt(contentGalleryEl.css('margin-top'), 10) + parseInt(contentGalleryEl.css('margin-bottom'), 10);
        var modalHorizontalWhitespace = parseInt(contentGalleryEl.css('margin-left'), 10) + parseInt(contentGalleryEl.css('margin-right'), 10);

        var attachmentContainerHeight = height - modalVerticalWhitespace;
        var attachmentContainerWidth = width - modalHorizontalWhitespace;
        contentGalleryEl.height(attachmentContainerHeight);
        contentGalleryEl.width(attachmentContainerWidth);

        var contentAttachmentEl = this.$el.find(GalleryAttachmentListView.prototype.focusedAttachmentsSelector + ' .content-attachment');
        contentAttachmentEl.css({'height': Math.min(attachmentContainerHeight, attachmentContainerWidth) + 'px', 'line-height': attachmentContainerHeight + 'px'});

        var focusedAttachmentEl = this.$el.find('.' + GalleryAttachmentListView.prototype.focusedAttachmentClassName + '> *');

        // remove aria and button stuff
        var focusedAttachmentDivEl = focusedAttachmentEl.parent();
        if (focusedAttachmentDivEl.length) {
            focusedAttachmentDivEl[0].removeAttribute('tabindex');
            focusedAttachmentDivEl[0].removeAttribute('role');
            focusedAttachmentDivEl[0].removeAttribute('aria-label');
        }

        // move focus to the modal
        var modalCloseButtonEl = this.$el.find(ModalView.prototype.closeButtonSelector);
        modalCloseButtonEl.focus();

        var maximizedBox = this.maximizeDimensions([attachmentContainerWidth, attachmentContainerHeight], aspectRatio);
        focusedAttachmentEl.css({
            width: maximizedBox[0] + 'px',
            height: maximizedBox[1] + 'px',
            maxWidth: maximizedBox[0] + 'px',
            maxHeight: maximizedBox[1] + 'px'
        });
    };

    /**
     * Find the biggest rectangle that fits within the containingBox, and that maintains the
     * aspectRatio (width divided by height).
     * To do so, compare aspect ratios:
     * - if containing box aspect ratio is larger, the containing box is wider, so the rectangle
     *   must be height constrained.
     * - if containing box aspect ratio is smaller, the containing box is narrower, so the rectangle
     *   must be width constrained.
     * - if they are equal, then we can just use the continaing box dimensions.
     *
     * @param {Array.<number>} containingBox
     * @param {number} aspectRatio Natural width divided by height
     * @return {Array.<number>} maximized dimensions
     */
    AttachmentGalleryModal.prototype.maximizeDimensions = function (containingBox, aspectRatio) {
        var containingBoxAspectRatio = containingBox[0] / containingBox[1];

        if (containingBoxAspectRatio > aspectRatio) {
            return [containingBox[1] * aspectRatio, containingBox[1]];
        } else if (containingBoxAspectRatio < aspectRatio) {
            return [containingBox[0], containingBox[0] * (1 / aspectRatio)];
        }

        return containingBox;
    };

    return AttachmentGalleryModal;
});
