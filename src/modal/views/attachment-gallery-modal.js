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
        this.$el.on('galleryResize.hub', function (e, opt_attachment) {
            self.resizeFocusedAttachment(opt_attachment);
        });

        return this;
    };


    /**
     * Resizes the focused attachment according to the viewport size.
     * @param {OembedView} opt_attachment
     */
    AttachmentGalleryModal.prototype.resizeFocusedAttachment = function (opt_attachment) {
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

        // Determines if the media is too large for the screen. This means that
        // it is greater than the 75% threshold.
        var isTooLarge = heightPercentage > ATTACHMENT_MAX_SIZE || widthPercentage > ATTACHMENT_MAX_SIZE;
        // Determines if the attachment is a video or not.
        var isVideo = opt_attachment && opt_attachment.oembed.type === 'video';

        // Resizes media depending on it's current size. If it's too large, it
        // will shrink it to be 75% of the height or width depending on the
        // percentage that the image currently takes up. If it's a video, it
        // will increase it's size to 75% of the screen.
        if (isVideo || isTooLarge) {
            var updateFn = widthPercentage < heightPercentage ?
                this.updateAttachmentHeight :
                this.updateAttachmentWidth;
            focusedAttachmentEl.css(updateFn.call(this, {
                focusedAttachmentHeight: focusedAttachmentHeight,
                focusedAttachmentWidth: focusedAttachmentWidth,
                height: height,
                modalHorizontalWhitespace: modalHorizontalWhitespace,
                modalVerticalWhitespace: modalVerticalWhitespace,
                width: width
            }));
        }
    };

    /**
     * Height-first attachment size updates. If the new width is too big for
     * the screen, use the width-first option.
     * @param {Object} opts - Options.
     * @param {number} focusedAttachmentHeight - Height of the attachment.
     * @param {number} focusedAttachmentWidth - Width of the attachment.
     * @param {boolean} force - Force the updates without checking the size
     *   again. Only used after checking the size while updating the other
     *   dimension (height vs width).
     * @param {number} height - Height of the modal.
     * @param {number} modalHorizontalWhitespace - Left and right margin
     *   surrounding the gallery.
     * @param {number} modalVerticalWhitespace - Top and bottom margin
     *   surrounding the gallery.
     * @param {number} width - Width of the modal.
     * @return {Object} The new height and width.
     */
    AttachmentGalleryModal.prototype.updateAttachmentHeight = function (opts) {
        var newHeight = Math.round(opts.height * AttachmentGalleryModal.ATTACHMENT_MAX_SIZE);
        var newWidth = Math.round((opts.focusedAttachmentWidth / opts.focusedAttachmentHeight) * newHeight);

        // If the new width is greater than the width of the modal, we need
        // to update the width of the modal first and then deal with the height.
        if (!opts.force && (newWidth + opts.modalHorizontalWhitespace) / opts.width >= 1) {
            opts.force = true;
            return this.updateAttachmentWidth(opts);
        }

        return {
            height: newHeight + 'px',
            width: newWidth + 'px'
        };
    };

    /**
     * Width-first attachment size updates. If the new height is too big for
     * the screen, use the height-first option.
     * @param {Object} opts - Options.
     * @param {number} focusedAttachmentHeight - Height of the attachment.
     * @param {number} focusedAttachmentWidth - Width of the attachment.
     * @param {boolean} force - Force the updates without checking the size
     *   again. Only used after checking the size while updating the other
     *   dimension (height vs width).
     * @param {number} height - Height of the modal.
     * @param {number} modalHorizontalWhitespace - Left and right margin
     *   surrounding the gallery.
     * @param {number} modalVerticalWhitespace - Top and bottom margin
     *   surrounding the gallery.
     * @param {number} width - Width of the modal.
     * @return {Object} The new height and width.
     */
    AttachmentGalleryModal.prototype.updateAttachmentWidth = function (opts) {
        var newWidth = Math.round(opts.width * AttachmentGalleryModal.ATTACHMENT_MAX_SIZE);
        var newHeight = Math.round((opts.focusedAttachmentHeight / opts.focusedAttachmentWidth) * newWidth);

        // If the new height is greater than the height of the modal, we need
        // to update the height of the modal first and then deal with the width.
        if (!opts.force && (newHeight + opts.modalVerticalWhitespace) / opts.height >= 1) {
            opts.force = true;
            return this.updateAttachmentHeight(opts);
        }

        return {
            height: newHeight + 'px',
            width: newWidth + 'px'
        };
    };

    return AttachmentGalleryModal;
});
