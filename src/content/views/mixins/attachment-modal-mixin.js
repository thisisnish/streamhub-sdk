var AttachmentGalleryModal = require('streamhub-sdk/modal/views/attachment-gallery-modal');
var GalleryAttachmentListView = require('streamhub-sdk/content/views/gallery-attachment-list-view');

'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have default card theme
 */
function hasAttachmentModal(contentView, modal) {
    if (! modal || modal === true) {
        modal = new AttachmentGalleryModal();
    }

    contentView.events = contentView.events.extended({
        'focusContent.hub': function(e, context) {
            if (! modal) {
                if (contentView &&
                    contentView.attachmentsView &&
                    typeof contentView.attachmentsView.focus === 'function') {
                    contentView.attachmentsView.focus(context.attachmentToFocus);
                }
            } else {
                var modalSubView = new GalleryAttachmentListView(context);
                modal.show(modalSubView);
            }
        }    
    });
    if (contentView.el) {
        contentView.delegateEvents();
    }
};

module.exports = hasAttachmentModal;
