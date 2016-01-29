var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var SingleAttachmentView = require('streamhub-sdk/content/views/single-attachment-view');

'use strict';

/**
 * Picks tile view or single view for thumbnails
 */
var ContentThumbnailViewFactory = function (opts) {
    this.opts = opts || {};
};

ContentThumbnailViewFactory.prototype.createThumbnailView = function (opts) {
    var thumbnailView;

    if (this.opts.singleMediaView) {
        thumbnailView = new SingleAttachmentView(opts);
    } else {
        thumbnailView = new TiledAttachmentListView(opts);
    }

    return thumbnailView;
};

module.exports = ContentThumbnailViewFactory;
