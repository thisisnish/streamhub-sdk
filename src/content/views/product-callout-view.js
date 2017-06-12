var i18n = require('streamhub-sdk/i18n');
var inherits = require('inherits');
var template = require('hgn!streamhub-sdk/content/templates/product-callout-view');
var View = require('view');
var ProductCarouselView = require('streamhub-sdk/content/views/product-carousel-view');
var Popover = require('streamhub-ui/popover');

'use strict';

function ProductCalloutView(opts) {
    opts.dataAttr = opts.dataAttr || {};
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

ProductCalloutView.prototype.createPopover = function () {
    if (this.popover) {
        document.getElementById('popover-div').appendChild(this.popover.el);
        this.popover.resizeAndReposition(this.el.children[0]);
        this.popover.positionArrowSmart(this.el.children[0]);
        return;
    }

    var product_popup = new ProductCarouselView($.extend({cardsInView: 2}, this.opts));
    product_popup.render();

    var width = this.$el.width();

    var $el = $(document.createElement('div'));
    $el.attr("id", "popover-div");
    $el.attr(this.opts.dataAttr);
    var $childEl = $(document.createElement('div'));
    $el.append($childEl);
    $el.appendTo(document.body);

    this.popover = new Popover({
        maxWidth: width + 10,
        minWidth: width + 10,
        el: $childEl
    });
    
    this.popover.$el.addClass('lf-product-popover');
    this.popover._position = Popover.POSITIONS.SMART_TOP;
    this.popover.setContentNode(product_popup.el);

    this.popover.resizeAndReposition(this.el.children[0]);
    this.popover.positionArrowSmart(this.el.children[0]); 

    this.popover.$el.on("mouseleave", function() {
        // $(this).detach();
    });
};


ProductCalloutView.prototype.events = View.prototype.events.extended({
    'mouseover .product-shop-button': function(e) {
       this.createPopover();
    },

    'mouseleave': function(e) {
        // hidePopover = (function () {
        //     this.detach();
        // }).bind(this.popover.$el);

        // var tOut = setTimeout(function() {hidePopover()}.bind(this.popover.$el), 100);
        
        // $(this.popover.$el).hover(function() { clearTimeout(tOut); });
    } 
});

module.exports = ProductCalloutView;
