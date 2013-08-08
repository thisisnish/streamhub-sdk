define(['streamhub-sdk/view', 'hgn!streamhub-sdk/content/templates/attachment'], function(View, AttachmentTemplate) {

    var OembedView = function(opts) {
        View.call(this);
        this.oembed = opts.oembed || {};
        if (!this.oembed) {
            return;
        }
        this.setElement(opts.el || document.createElement(this.elTag));
    };
    OembedView.prototype = View.prototype;

    OembedView.prototype.template = AttachmentTemplate;

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
        var context = $.extend({}, this.oembed);
        context.renderAttachment = this.renderAttachment;
        this.$el.html(this.template(context));

        // handle oembed loading gracefully
        var self = this;
        var newImg = this.$el.find('img');
        newImg.hide();
        newImg.on('load', function() {
            newImg.fadeIn();
            self.$el.trigger('imageLoaded.hub');
        });
        newImg.on('error', function() {
            self.$el.trigger('imageError.hub', self.oembed);
            //self.content.attachments.pop();
            //self.$el.find('.content-attachments').empty();
            //self.$el.removeClass('content-with-image');
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
