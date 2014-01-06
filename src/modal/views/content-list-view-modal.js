define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/modal',
    'streamhub-sdk/content/content-view-factory',
    'streamhub-sdk/content/views/content-list-view',
    'inherits'
], function($, ModalView, ContentViewFactory, ContentListView, inherits) {
    'use strict';

    /**
     * A view that overlays over the entire viewport to display some content
     *
     * @param opts {Object} A set of options to config the view with
     * @fires ContentListViewModal#hideModal.hub
     * @exports streamhub-sdk/modal/views/attachment-gallery-modal
     * @constructor
     */
    var ContentListViewModal = function (opts) {
        opts = opts || {};
        ModalView.call(this, opts);

        this._contentViewFactory = new ContentViewFactory();
    };
    inherits(ContentListViewModal, ModalView);


    /**
     * Set the element for the view to render in.
     * ModalView construction takes care of creating its own element in
     *     ModalView.el. You probably don't want to call this manually
     * @private
     * @param element {HTMLElement} The element to render this View in
     * @returns this
     */
    ContentListViewModal.prototype.setElement = function (element) {
        ModalView.prototype.setElement.call(this, element);

        var self = this;
        this.$el.on('click', function (e) {
            /**
             * Hide modal
             * @event GalleryAttachmentListView#hideModal.hub
             */
            if ($(e.target).hasClass('hub-modal-content')) {
                self.$el.trigger('hideModal.hub');
            }
        });

        return this;
    };

    return ContentListViewModal;
});
