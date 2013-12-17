define([
    'streamhub-sdk/modal',
    'streamhub-sdk/content/content-view-factory',
    'streamhub-sdk/content/views/content-list-view',
    'inherits'
], function(ModalView, ContentViewFactory, ContentListView, inherits) {
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
        ModalView.call(this, opts);

        this._contentViewFactory = new ContentViewFactory();
    };
    inherits(ContentListViewModal, ModalView);


    /**
     * Creates a the content view to display within the modal view
     * @param contentItems {Content[]} The content to be displayed in the content view by the modal
     * @param opts {Object} The content to be displayed in the content view by the modal
     * @private
     */
    ContentListViewModal.prototype._createContentView = function (contentItems, opts) {
        opts = opts || {};

        if (!contentItems.length) {
            contentItems = [contentItems];
        }
        this._contentItems = contentItems;

        var contentListView = new ContentListView();

        return contentListView;
    };

    ContentListViewModal.prototype.render = function () {
        ModalView.prototype.render.call(this);

        for (var i=0; i < this._contentItems.length; i++) {
            this.modalContentView.add(this._contentItems[i]);
        }
    };


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


    /**
     * Sets the content object and optional attachment to be displayed in the content view 
     * @private
     * @param content {Content|ContentView} The content to be displayed in the content view by the modal
     * @param opts {Object} The content to be displayed in the content view by the modal
     * @param opts.attachment {Oembed} The attachment to be focused in the content view
     */
    ContentListViewModal.prototype._setFocus = function (content, opts) {
        opts = opts || {};
        this.modalContentView = this._createContentView(content, opts);
        this._rendered = false;
    };

    return ContentListViewModal;
});
