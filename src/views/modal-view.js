define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/view',
    'streamhub-sdk/content/views/gallery-attachment-list-view',
    'hgn!streamhub-sdk/views/templates/modal-view',
    'streamhub-sdk/util'
], function($, View, GalleryAttachmentListView, ModalTemplate, util) {

    var ModalView = function (opts) {
        opts = opts || {};
        this.visible = false;
        if (opts.modal) {
            this.createModalContentView = opts.modal;
        }

        View.call(this);

        var self = this;
        $(window).keyup(function(e) {
            // Escape
            if (e.keyCode == 27 && self.visible) {
                self.hide();
            }
        });

        $(window).on('mousewheel', function(e) {
            if (self.visible) {
                e.preventDefault();
            }
        });
    };
    util.inherits(ModalView, View);

    ModalView.prototype.template = ModalTemplate;

    ModalView.prototype.modalElSelector = '.hub-modal';
    ModalView.prototype.closeButtonSelector = '.hub-modal-close';
    ModalView.prototype.containerElSelector = '.hub-modal-content';

    ModalView.prototype.setElement = function (element) {
        View.prototype.setElement.call(this, element);

        var self = this;
        this.$el.on('hideModal.hub', function (e) {
            self.hide();
        });
    };

    ModalView.prototype.initModal = function () {
        var modalEl = $(this.modalElSelector, 'body');
        if (! modalEl.length) {
            modalEl = $(this.template());
            $('body').append(modalEl);
        }
        this.modalEl = modalEl;
        this.modalContainerEl = modalEl.find(this.containerElSelector);

        var self = this;
        modalEl.on('click', this.closeButtonSelector, function (e) {
            self.hide();
        });

        this.setElement(this.modalContainerEl);
    };

    ModalView.prototype.setFocus = function (content, opts) {
        opts = opts || {};
        if (! this.modalContentView) {
            this.modalContentView = this.createModalContentView();
        }
        this.modalContentView.setContent(content);
        if (opts.attachment) {
            this.modalContentView.setFocusedAttachment(opts.attachment);
        }
    };

    ModalView.prototype.createModalContentView = function (content, opts) {
        opts = opts || {};
        var modalContentView = new GalleryAttachmentListView({
            content: content,
            attachmentToFocus: opts.attachment
        });
        return modalContentView;
    };

    ModalView.prototype.render = function () {
        if (! this.modalEl) {
            this.initModal();
        }
        if (! this.modalContentView) {
            this.modalContentView = this.createModalContentView();
        }
        this.modalContentView.$el.appendTo(this.modalContainerEl);
        this.modalContentView.render(); 
    };

    ModalView.prototype.show = function() {
        this.render();
        this.modalContentView.$el.show();
        this.modalEl.show();
        this.visible = true;
    };

    ModalView.prototype.hide = function() {
        this.modalEl.hide();
        this.visible = false;
    };

    return ModalView;
});
