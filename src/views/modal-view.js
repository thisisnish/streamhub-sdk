define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/view',
    'hgn!streamhub-sdk/views/templates/modal-view',
    'streamhub-sdk/util'
], function($, View, ModalTemplate, util) {

    var ModalView = function() {
        this.visible = false;
        View.call(this, { el: $('body')[0] });
    };
    util.inherits(ModalView, View);

    ModalView.prototype.template = ModalTemplate;

    ModalView.prototype.initialize = function() {
        var self = this;
        // Escape
        $(document).keyup(function(e) {
            if (e.keyCode == 27 && self.visible) {
                self.hide();
            }
        });

        // Close click
        this.$el.on('click', '.hub-modal', function(e) {
            self.hide();
        });

        $(window).on('mousewheel', function(e) {
            if (self.visible) {
                e.preventDefault();
            }
        });
    };

    ModalView.prototype.closeButtonSelector = '.hub-modal-close';

    ModalView.prototype.render = function () {
        if (! this.isInitialized()) {
            this.$el.append(this.template());
        }
    };

    ModalView.prototype.toggle = function() {
        this.visible ? this.hide() : this.show();
        this.visible = !this.visible;
    };

    ModalView.prototype.show = function() {
        this.$el.find('.hub-modal').show();
        this.visible = true;
    };

    ModalView.prototype.hide = function() {
        this.$el.find('.hub-modal').hide();
        this.$el.find('.hub-modal .hub-modal-content').empty();
        this.visible = false;
    };

    ModalView.prototype.isInitialized = function() {
        if ($('body > .hub-modal').length) {
            return true;
        }
        return false;
    };

    return ModalView;
});
