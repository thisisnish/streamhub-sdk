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
    };

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
    };

    ModalView.prototype.hide = function() {
        this.$el.find('.hub-modal').hide();
    };

    ModalView.prototype.isInitialized = function() {
        if ($('body > .hub-modal').length) {
            return true;
        }
        return false;
    };

    return ModalView;
});
