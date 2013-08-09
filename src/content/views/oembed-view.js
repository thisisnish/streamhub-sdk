define([
    'streamhub-sdk/view',
    'hgn!streamhub-sdk/content/templates/oembed-photo',
    'hgn!streamhub-sdk/content/templates/oembed-video',
    'hgn!streamhub-sdk/content/templates/oembed-link',
    'hgn!streamhub-sdk/content/templates/oembed-rich'
],
function(View, OembedPhotoTemplate, OembedVideoTemplate, OembedLinkTemplate, OembedRichTemplate) {

    var OembedView = function(opts) {
        View.call(this);
        this.oembed = opts.oembed || {};
        if (!this.oembed) {
            return;
        }
        this.setElement(opts.el || document.createElement(this.elTag));
    };
    OembedView.prototype = View.prototype;

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
        context.renderAttachment = this.renderAttachment;
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

    OembedView.prototype.renderAttachment = function () {
        var linkHtml;
        switch (this.type) {
            case 'photo':
                return '<img src="{url}" />'.replace('{url}', this.url);
            case 'video':
                return this.html;
            case 'link':
                /** @todo show thumbnails */
                linkHtml = '<a href="{href}">{body}</a>'
                    .replace("{href}", this.url)
                    .replace("{body}", linkAttachmentBody(this));
                return linkHtml;
            case 'rich':
                return this.html;
            default:
                return '';
        }
    };

    function linkAttachmentBody (oembed) {
        var body = oembed.title;
        if (oembed.thumbnail_url) {
            body = '<img src="'+oembed.thumbnail_url+'" />';
        }
        return body;
    }

    return OembedView;
});
