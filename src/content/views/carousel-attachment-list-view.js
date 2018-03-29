var AttachmentListView = require('streamhub-sdk/content/views/attachment-list-view');
var template = require('hgn!streamhub-sdk/content/templates/carousel-attachment-list');
var inherits = require('inherits');

var CarouselAttachmentListView = function (opts) {
    opts = opts || {};
    AttachmentListView.call(this, opts);
};
inherits(CarouselAttachmentListView, AttachmentListView);

CarouselAttachmentListView.prototype.template = template;
CarouselAttachmentListView.prototype.elClass = 'carousel-attachment-list';
CarouselAttachmentListView.prototype.stackedAttachmentsSelector = '.content-attachments-stacked';
CarouselAttachmentListView.prototype.contentAttachmentSelector = '.content-attachment';
CarouselAttachmentListView.prototype.listLengthAttribute = 'data-hub-list-length';

module.exports = CarouselAttachmentListView;
