var i18n = require('streamhub-sdk/i18n');
var inherits = require('inherits');
var template = require('hgn!streamhub-sdk/content/templates/product-callout-view');
var View = require('view');

'use strict';

function ProductCalloutView(opts) {
    View.call(this, opts);
}
inherits(ProductCalloutView, View);

ProductCalloutView.prototype.template = template;
ProductCalloutView.prototype.elClass = 'product-callout';

ProductCalloutView.prototype.getTemplateContext = function () {
    var productIndicationText = i18n.get('productIndicationText', 'Shop').trim();
    return {
        productIndicationText: productIndicationText,
        productIndicationShow: productIndicationText.length > 0,
        showProduct: this.opts.productOptions.show
    };
};

module.exports = ProductCalloutView;
