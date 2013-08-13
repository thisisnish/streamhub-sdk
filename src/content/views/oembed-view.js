define([
    'streamhub-sdk/view',
    'hgn!streamhub-sdk/content/templates/oembed-photo',
    'hgn!streamhub-sdk/content/templates/oembed-video',
    'hgn!streamhub-sdk/content/templates/oembed-link',
    'hgn!streamhub-sdk/content/templates/oembed-rich',
    'streamhub-sdk/util'
],
function(View, OembedPhotoTemplate, OembedVideoTemplate, OembedLinkTemplate, OembedRichTemplate, util) {

    var OembedView = function(opts) {
        View.call(this);
        this.oembed = opts.oembed || {};
        if (!this.oembed) {
            return;
        }
        this.setElement(opts.el || document.createElement(this.elTag));
    };
    util.inherits(OembedView, View);

    OembedView.prototype.OEMBED_TEMPLATES = {
        'photo': OembedPhotoTemplate,
        'video': OembedVideoTemplate,
        'link':  OembedLinkTemplate,
        'rich':  OembedRichTemplate
    };

     /**
     * Set the .el DOMElement that the OembedView should render to
     * @param el {DOMElement} The new element the OembedView should render to
     */
    OembedView.prototype.setElement = function (el) {
        this.el = el;
        this.$el = $(el);
    };

    OembedView.prototype.elTag = 'div';

    OembedView.prototype.render = function() {
        this.template = this.OEMBED_TEMPLATES[this.oembed.type];
        if (this.oembed.provider_name == 'YouTube') {
            var re = /(hqdefault.jpg)$/;
            if (re.test(this.oembed.thumbnail_url)) {
                this.oembed.thumbnail_url = this.oembed.thumbnail_url.replace(re, 'mqdefault.jpg');
            }
        }
        var context = $.extend({}, this.oembed);
        this.$el.html(this.template(context));

        if (this.oembed.type != 'photo' && this.oembed.type != 'video') {
            return;
        }

        // handle oembed loading gracefully
        var self = this;
        var newImg = this.$el.find('img');
        newImg.hide();
        newImg.on('load', function() {
            if (newImg.parent().is('.content-attachment-photo')) {
                newImg.parent().fadeIn();
            } else {
                newImg.fadeIn();
            }
            self.$el.trigger('imageLoaded.hub');
        });
        newImg.on('error', function() {
            self.$el.trigger('imageError.hub', self.oembed);
        });
    };

    return OembedView;
});
