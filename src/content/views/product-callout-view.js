var $ = require('streamhub-sdk/jquery');
var i18n = require('streamhub-sdk/i18n');
var inherits = require('inherits');
var template = require('hgn!streamhub-sdk/content/templates/product-callout-view');
var View = require('view');
var ProductCarouselView = require('streamhub-sdk/content/views/product-carousel-view');
var Popover = require('streamhub-ui/popover');

'use strict';

function ProductCalloutView(opts) {
    if (!opts.hasOwnProperty('popoverEnabled')) {
        opts.popoverEnabled = true;
    }
    opts.dataAttr = opts.dataAttr || {};
    View.call(this, opts);
}
inherits(ProductCalloutView, View);

ProductCalloutView.prototype.template = template;
ProductCalloutView.prototype.elClass = 'product-callout';
ProductCalloutView.prototype.popoverDivClass = 'popover-div';
ProductCalloutView.prototype.productPopoverClass = 'lf-product-popover';

ProductCalloutView.prototype.getTemplateContext = function () {
    var productIndicationText = i18n.get('productIndicationText', 'Shop').trim();
    return {
        productIndicationText: productIndicationText,
        productIndicationShow: productIndicationText.length > 0
    };
};

/**
 * On mouseover of product shop button, creates a product popover that displays a product carousel view.
 */
ProductCalloutView.prototype.createPopover = function () {
    if (this.popover) {
        document.getElementById(this.popoverDivClass).appendChild(this.popover.el);
        this.sizeAndPosition();
        return;
    }

    var product_popup = new ProductCarouselView($.extend({ cardsInView: 2 }, this.opts));
    product_popup.render();

    var $el = $(document.createElement('div'));
    $el.attr('id', this.popoverDivClass);
    $el.attr(this.opts.dataAttr);
    var $childEl = $(document.createElement('div'));
    $el.append($childEl);
    $el.appendTo(document.body);

    this.popover = new Popover({
        el: $childEl
    });

    this.popover.$el.addClass(this.productPopoverClass);
    this.popover._position = Popover.POSITIONS.SMART_TOP;
    this.popover.setContentNode(product_popup.el);

    this.sizeAndPosition();

    this.popover.$el.on('mouseleave', function () {
        $(this).detach();
    });
};

ProductCalloutView.prototype.setNewOpts = function (newOpts) {
    var opts = newOpts;
    opts.el = this.opts.el;
    opts.dataAttr = this.opts.dataAttr;
    opts.popoverEnabled = this.opts.hasOwnProperty('popoverEnabled') ? this.opts.popoverEnabled : true;
}

ProductCalloutView.prototype.render = function () {
    var productOptions = this.opts.productOptions;
    var hasProducts = this.opts.content && this.opts.content.hasProducts();
    var hasRights = productOptions &&
        ((productOptions.requireRights && this.opts.content.hasRightsGranted()) ||
            !productOptions.requireRights);
    if (hasProducts && hasRights && productOptions.show && productOptions.showCallout) {
        View.prototype.render.call(this);
        return this;
    } else {
        this.el.innerHTML = '';
    }
    return;
};

ProductCalloutView.prototype.sizeAndPosition = function () {
    var parentEl = this.el.parentElement;
    var shopBtn = this.el.children[0];

    if (parentEl.offsetWidth === this.el.offsetWidth) {
        this.popover.resizeAndReposition(shopBtn);
        this.popover.setProductPopoverWidth(shopBtn);
        this.popover.positionArrowSmart(shopBtn);
        return;
    }

    this.popover.resizeAndReposition(shopBtn);
    this.popover.setProductPopoverWidth(this.el);
    this.popover.positionArrowSmart(shopBtn);
};

ProductCalloutView.prototype.events = View.prototype.events.extended({
    'mouseover .product-shop-button': function (e) {
        if (!this.opts.popoverEnabled) {
            return;
        }
        this.createPopover();
    },

    'mouseleave': function (e) {
        if (!this.popover) {
            return;
        }
        hidePopover = (function () {
            this.detach();

        }).bind(this.popover.$el);

        var tOut = setTimeout(function () { hidePopover() }, 100);

        $(this.popover.$el).mouseover(function () { clearTimeout(tOut); });
    }
});

module.exports = ProductCalloutView;
