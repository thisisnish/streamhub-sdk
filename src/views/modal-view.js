define([
    'streamhub-sdk/view',
    'hgn!streamhub-sdk/views/templates/modal-view',
    'streamhub-sdk/util'
], function(View, ModalTemplate, util) {

    var ModalView = function() {
        View.call(this, { el: document.getElementsByTagName('body')[0] });
        this._initialized = false;
    };
    util.inherits(ModalView, View);

    ModalView.prototype.template = ModalTemplate;

    ModalView.prototype.render = function () {
        if (! this._initialized) {
            this.$el.append(this.template());
            this._initialized = true;
        }
    };

    return ModalView;
});
