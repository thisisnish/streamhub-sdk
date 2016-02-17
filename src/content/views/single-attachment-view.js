var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var inherits = require('inherits');

'use strict';

/**
 * A version of the tiled attachement list view that only shows a single image
 * @param opts {Object} A set of options to config the view with
 * @param opts.el {HTMLElement} The element in which to render the streamed content
 * @param opts.content {Content} The content instance with which to display its attachments
 * @fires TiledAttachmentListView#focusContent.hub
 * @exports streamhub-sdk/views/single-attachment-view
 * @constructor
 */
var SingleAttachmentListView = function (opts) {
    opts = opts || {};
    TiledAttachmentListView.call(this, opts);
};
inherits(SingleAttachmentListView, TiledAttachmentListView);

SingleAttachmentListView.prototype.additionalImagesSelector = '.content-attachment-additional-images';
SingleAttachmentListView.prototype.photoContentSelector = '.content-attachment-photo';

SingleAttachmentListView.prototype.retile = function () {
    if ( ! this.el ) {
        return;
    }
    var tiledAttachmentsEl = this.$el.find(this.tiledAttachmentsSelector);
    var firstItemEl = tiledAttachmentsEl.find(this.contentAttachmentSelector + ':first');

    // Add classes so only the first media shows and the other remain hidden
    tiledAttachmentsEl.addClass('content-attachments-1');
    firstItemEl.addClass(this.squareTileClassName);

    if (firstItemEl.length === 1 && this.tileableCount() > 1 && firstItemEl.find(this.additionalImagesSelector).length === 0) {
        var imageCountDom = '<span class="content-attachment-additional-images">+' + this.tileableCount() + '</span>';
        firstItemEl.find(this.photoContentSelector).append(imageCountDom);
    }
};

module.exports = SingleAttachmentListView;
