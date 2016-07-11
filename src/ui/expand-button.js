var Command = require('streamhub-sdk/ui/command');
var GalleryAttachmentListView = require('streamhub-sdk/content/views/gallery-attachment-list-view');
var HubButton = require('streamhub-sdk/ui/hub-button');
var inherits = require('inherits');
var ModalView = require('streamhub-sdk/modal');

'use strict';

function ExpandButton(fnOrCommand, opts) {
    opts = opts || {};
    opts.className = opts.className || 'content-action content-action-expand';
    fnOrCommand = fnOrCommand || new Command(this._showExpandModal.bind(this), opts);
    HubButton.call(this, fnOrCommand, opts);
}
inherits(ExpandButton, HubButton);

ExpandButton.prototype.elClassPrefix = 'hub';

ExpandButton.prototype._showExpandModal = function () {
    var modal = new ModalView();
    modal.show(new GalleryAttachmentListView(this.opts.contentView));
};

module.exports = ExpandButton;
