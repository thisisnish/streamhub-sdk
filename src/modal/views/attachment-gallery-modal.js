define([
    'streamhub-sdk/modal',
    'streamhub-sdk/content/views/gallery-attachment-list-view',
    'inherits'
], function(ModalView, GalleryAttachmentListView, inherits) {
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
    };
    inherits(AttachmentGalleryModal, ModalView);

    /**
     * Percentage of the modal that the attachment should take up. If it's
     * smaller than this, it is enlarged to this -- keeping the aspect ratio
     * the same.
     * @const {number}
     */
    AttachmentGalleryModal.ATTACHMENT_MAX_SIZE = 0.75;

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
        this.$el.on('galleryResize.hub', function (e) {
            self.resizeFocusedAttachment();
        });

        return this;
    };


    /**
     * Resizes the focused attachment according to the viewport size
     */
    AttachmentGalleryModal.prototype.resizeFocusedAttachment = function () {
        var ATTACHMENT_MAX_SIZE = AttachmentGalleryModal.ATTACHMENT_MAX_SIZE;
        var height = this.$el.height();
        var width = this.$el.width();

        var newHeight;
        var newWidth;

        var contentGalleryEl = this.$el.find(GalleryAttachmentListView.prototype.attachmentsGallerySelector);
        var modalVerticalWhitespace = parseInt(contentGalleryEl.css('margin-top'), 10) + parseInt(contentGalleryEl.css('margin-bottom'), 10);
        var modalHorizontalWhitespace = parseInt(contentGalleryEl.css('margin-left'), 10) + parseInt(contentGalleryEl.css('margin-right'), 10);

        var attachmentContainerHeight = height - modalVerticalWhitespace;
        var attachmentContainerWidth = width - modalHorizontalWhitespace;
        contentGalleryEl.height(attachmentContainerHeight);
        contentGalleryEl.width(attachmentContainerWidth);

        var contentAttachmentEl = this.$el.find(GalleryAttachmentListView.prototype.focusedAttachmentsSelector + ' .content-attachment');
        contentAttachmentEl.css({ 'height': Math.min(attachmentContainerHeight, attachmentContainerWidth) + 'px', 'line-height': attachmentContainerHeight + 'px' });

        var focusedAttachmentEl = this.$el.find('.'+GalleryAttachmentListView.prototype.focusedAttachmentClassName + '> *');
        var focusedAttachmentHeight = focusedAttachmentEl.attr('height');
        var focusedAttachmentWidth = focusedAttachmentEl.attr('width');

        // Reset attachment dimensions
        if (focusedAttachmentWidth) {
            focusedAttachmentEl.css({ 'width': parseInt(focusedAttachmentWidth, 10) + 'px' });
        } else {
            focusedAttachmentEl.css({ 'width': 'auto' });
        }
        if (focusedAttachmentHeight) {
            focusedAttachmentEl.css({ 'height': parseInt(focusedAttachmentHeight, 10) + 'px' });
        } else {
            focusedAttachmentEl.css({ 'height': 'auto', 'line-height': 'inherits' });
        }

        var heightPercentage = (focusedAttachmentEl.height() + modalVerticalWhitespace) / height;
        var widthPercentage = (focusedAttachmentEl.width() + modalHorizontalWhitespace) / width;

        // If the height is larger than the size of the container, or the height
        // is not set at all, set the values so that it looks OK.
        if (heightPercentage >= 1 || focusedAttachmentEl.height() === 0) {
            focusedAttachmentEl.css({
                'height': Math.min(attachmentContainerHeight, attachmentContainerWidth) + 'px',
                'line-height': Math.min(attachmentContainerHeight, attachmentContainerWidth) + 'px'
            });
            if (focusedAttachmentWidth) {
                newWidth = Math.min(parseInt(focusedAttachmentWidth, 10), focusedAttachmentEl.width());
                focusedAttachmentEl.css({ 'width': newWidth + 'px' });
            } else {
                focusedAttachmentEl.css({ 'width': 'auto' });
            }
        }

        // If the width is larger than the size of the container, or the width
        // is not set at all, set the values so that it looks OK.
        if (widthPercentage >= 1 || focusedAttachmentEl.width() === 0) {
            focusedAttachmentEl.css({ 'width': attachmentContainerWidth + 'px' });
            if (focusedAttachmentHeight) {
                newHeight = Math.min(parseInt(focusedAttachmentHeight, 10), focusedAttachmentEl.height());
                focusedAttachmentEl.css({ 'height': newHeight + 'px' });
            } else {
                focusedAttachmentEl.css({ 'height': 'auto', 'line-height': 'inherits' });
            }
        }

        // Get the sizes again because they could have been updated earlier in
        // this function.
        focusedAttachmentHeight = focusedAttachmentEl.height();
        focusedAttachmentWidth = focusedAttachmentEl.width();
        heightPercentage = (focusedAttachmentHeight + modalVerticalWhitespace) / height;
        widthPercentage = (focusedAttachmentWidth + modalHorizontalWhitespace) / width;

        // Increase the size of the attachment while keeping it's size ratio
        // the same. The threshold is 60% of the height or width depending on
        // the percentage that the image currently takes up.
        // 
        // markd: The problem with this could be that the size of the attachment
        // is only supposed to be a certain size and we're enlarging it when
        // we shouldn't.
        // 
        if (heightPercentage < ATTACHMENT_MAX_SIZE && widthPercentage < ATTACHMENT_MAX_SIZE) {
            if (widthPercentage < heightPercentage) {
                newHeight = height * ATTACHMENT_MAX_SIZE;
                newWidth = (focusedAttachmentWidth / focusedAttachmentHeight) * newHeight;
            } else {
                newWidth = width * ATTACHMENT_MAX_SIZE;
                newHeight = (focusedAttachmentHeight / focusedAttachmentWidth) * newWidth;
            }
            focusedAttachmentEl.css({ height: newHeight + 'px', width: newWidth + 'px' });
        }
    };

    return AttachmentGalleryModal;
});
