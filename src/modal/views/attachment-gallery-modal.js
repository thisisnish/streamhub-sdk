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
     * Percentage of the modal that the attachment should take up. If it's
     * smaller than this, it is enlarged to this -- keeping the aspect ratio
     * the same.
     * @const {number}
     */
    AttachmentGalleryModal.ATTACHMENT_MAX_SIZE = 0.75;

    /**
     * Percentage of the modal that the attachment should take up. If it's
     * smaller than this, it is enlarged to this -- keeping the aspect ratio
     * the same. This is different than the other because this only pertains
     * to when there is padding, the attachment should take up more of the space
     * since it's being more limited overall.
     * @const {number}
     */
    AttachmentGalleryModal.ATTACHMENT_MAX_SIZE_WITH_PADDING = 0.90;

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
        this.$el.on('galleryResize.hub', function (e, opt_attachment, opt_aspectRatio) {
            self.resizeFocusedAttachment(opt_attachment, opt_aspectRatio);
        });

        return this;
    };


    /**
     * Resizes the focused attachment according to the viewport size.
     * @param {OembedView} opt_attachment
     * @param {boolean=} opt_aspectRatio
     */
    AttachmentGalleryModal.prototype.resizeFocusedAttachment = function (opt_attachment, opt_aspectRatio) {
        var ATTACHMENT_MAX_SIZE = this._isMobile ?
            AttachmentGalleryModal.ATTACHMENT_MAX_SIZE_WITH_PADDING :
            AttachmentGalleryModal.ATTACHMENT_MAX_SIZE;
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

        // To determine if we need to call the modal resize function, it would
        // be nice to have the actual size of the attachment if we can get it.
        // This will make it much easier to calculate correctly.
        if (opt_attachment && opt_attachment.oembed) {
            focusedAttachmentHeight = opt_attachment.oembed.height || focusedAttachmentHeight;
            focusedAttachmentWidth =  opt_attachment.oembed.width || focusedAttachmentWidth;
        }

        // Calculate the height and width percentages of the modal to determine
        // what needs to happen (if anything) to the attachment size.
        heightPercentage = (focusedAttachmentHeight + modalVerticalWhitespace) / height;
        widthPercentage = (focusedAttachmentWidth + modalHorizontalWhitespace) / width;

        // Determines if the media is too large for the screen. This means that
        // it is greater than the 75% threshold.
        var isTooLarge = heightPercentage > ATTACHMENT_MAX_SIZE || widthPercentage > ATTACHMENT_MAX_SIZE;
        // Determines if the attachment is a youtube video or not.
        var isYoutube = opt_attachment && (opt_attachment.oembed.provider_name || '').toLowerCase() === 'youtube';

        // Resizes media depending on it's current size. If it's too large, it
        // will shrink it to be 75% of the height or width depending on the
        // percentage that the image currently takes up. If it's a youtube video,
        // it will increase it's size to 75% of the screen.
        //
        // NOTE: This is only done for youtube videos because their native size
        // is large by default and can resize properly. Other video types do not.
        if (isTooLarge || isYoutube) {
            focusedAttachmentEl.css(this.updateAttachmentToFitModal.call(this, {
                aspectRatio: opt_aspectRatio,
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
     * Updates the attachment's height and width to be as large as possible
     * while fitting within the modal.
     * @param {Object} opts - Options.
     * @param {Object=} aspectRatio - Optional aspect ratio of the attachment.
     * @param {number} focusedAttachmentHeight - Height of the attachment.
     * @param {number} focusedAttachmentWidth - Width of the attachment.
     * @param {number} height - Height of the modal.
     * @param {number} modalHorizontalWhitespace - Left and right margin
     *   surrounding the gallery.
     * @param {number} modalVerticalWhitespace - Top and bottom margin
     *   surrounding the gallery.
     * @param {number} width - Width of the modal.
     * @return {Object} The new height and width.
     */
    AttachmentGalleryModal.prototype.updateAttachmentToFitModal = function (opts) {
        var MAX_SIZE = this._isMobile ?
            AttachmentGalleryModal.ATTACHMENT_MAX_SIZE_WITH_PADDING :
            AttachmentGalleryModal.ATTACHMENT_MAX_SIZE;
        var aspectRatio = opts.aspectRatio;

        var isPortrait = window.innerHeight < window.innerWidth && this._isMobile;
        var heightLarger = opts.focusedAttachmentHeight > opts.focusedAttachmentWidth;
        var tempVertSpace;

        if (isPortrait && !heightLarger) {
            tempVertSpace = opts.modalVerticalWhitespace;
            opts.modalVerticalWhitespace = opts.modalHorizontalWhitespace;
            opts.modalHorizontalWhitespace = tempVertSpace;
        }

        var maxHeight = opts.height * MAX_SIZE - opts.modalVerticalWhitespace;
        var maxWidth = opts.width * MAX_SIZE - opts.modalHorizontalWhitespace;

        // Unset the apsect ratio if it's set to 100 for both the height and
        // width. That value is only for setting the CSS height and width
        // percentages of the attachment. It will cause problems with this
        // function if used like that.
        if (aspectRatio && aspectRatio.height === 100 && aspectRatio.width === 100) {
            aspectRatio = null;
        }

        // If no aspect ratio was provided, generate one based on the size of
        // the focused attachment.
        if (!aspectRatio) {
            aspectRatio = {
                height: (opts.focusedAttachmentHeight / opts.focusedAttachmentWidth) * 100,
                width: (opts.focusedAttachmentWidth / opts.focusedAttachmentHeight) * 100
            }
        }

        /**
         * Calculate the height and width based on the aspect ratio.
         * @param {number} height - Height of the attachment.
         * @param {number} width - Width of the attachment.
         * @return {Array.<number, number>} Aspect ratio size of the attachment.
         */
        function calculateSizeByAspectRatio(height, width) {
            var newHeight;
            var newWidth;

            if (aspectRatio.height > aspectRatio.width) {
                newHeight = height;
                newWidth = newHeight * (aspectRatio.width / 100);
            } else {
                newWidth = width;
                newHeight = newWidth * (aspectRatio.height / 100);
            }
            return [newHeight, newWidth];
        }

        /**
         * Recursively updates the sizing of the attachment until it fits within
         * the max height and max width of the modal.
         * @param {number} height - Height of the attachment.
         * @param {number} width - Width of the attachment.
         * @return {Object} New height and width that fit within the modal.
         */
        function updateSizing(height, width) {
            if (height > maxHeight || width > maxWidth) {
                if (height > width) {
                    height > maxHeight ? (height = maxHeight) : (height -= 10);
                } else {
                    width > maxWidth ? (width = maxWidth) : (width -= 10);
                }
                return updateSizing.apply(null, calculateSizeByAspectRatio(height, width));
            }
            return {height: height, width: width};
        }

        var size = calculateSizeByAspectRatio(opts.focusedAttachmentHeight, opts.focusedAttachmentWidth);
        var height = size[0];
        var width = size[1];

        // We want to capture any sizes that are too small so that they can be
        // increased to fill the size of the modal. If by doing this, the size
        // is too large, the `updateSizing` function will make it fit within
        // the maximum size (75% of the height and width).
        if (height < maxHeight && width < maxWidth) {
            if (aspectRatio.height > aspectRatio.width) {
                height = maxHeight;
                width = height * (aspectRatio.width / 100);
            } else {
                width = maxWidth;
                height = width * (aspectRatio.height / 100);
            }
        }

        size = updateSizing(height, width);
        return {
            height: Math.round(size.height) + 'px',
            width: Math.round(size.width) + 'px'
        };
    };

    return AttachmentGalleryModal;
});
