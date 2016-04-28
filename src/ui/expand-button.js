'use strict';

var HubButton = require('streamhub-sdk/ui/hub-button');
var inherits = require('inherits');
var Command = require('streamhub-sdk/ui/command');
var ModalView = require('streamhub-sdk/modal');
var GalleryAttachmentListView = require('streamhub-sdk/content/views/gallery-attachment-list-view');

function ExpandButton (fnOrCommand, opts) {
    opts = opts || {};
    opts.elClassPrefix = opts.elClassPrefix || '';
    fnOrCommand = fnOrCommand || new Command(this._showExpandModal.bind(this), opts);
    HubButton.call(this, fnOrCommand, opts);
}
inherits(ExpandButton, HubButton);

ExpandButton.prototype._showExpandModal = function () {
    var modal = new ModalView();
    var modalSubView = new GalleryAttachmentListView(this.opts.contentView);
    modal.show(modalSubView);
};
module.exports = ExpandButton;