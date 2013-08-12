define(['streamhub-sdk/jquery', 'streamhub-sdk/content/views/oembed-view'],
function($, OembedView) {
    
    /**
     * A simple View that displays Content in a list (`<ul>` by default).
     * @param opts {Object} A set of options to config the view with
     * @param opts.el {HTMLElement} The element in which to render the streamed content
     * @exports streamhub-sdk/views/list-view
     * @constructor
     */
    var AttachmentListView = function(opts) {
        opts = opts || {};
        this.setElement(opts.el || document.createElement(this.elTag));
        this.oembedViews = [];

        var self = this;
        $(window).resize(function(e) {
            if (self.count() && self.$el.find('.content-attachments-tiled').length) {
                self.render();
            }
        });
    };

    AttachmentListView.prototype.elTag = 'div';
    
    /**
     * Set the element for the view to render in.
     * You will probably want to call .render() after this, but not always.
     * @param element {HTMLElement} The element to render this View in
     * @return this
     * @param
     */
    AttachmentListView.prototype.setElement = function (element) {
        this.el = element;
        this.$el = $(element);

        return this;
    };

    AttachmentListView.prototype.count = function() {
        return this.oembedViews.length;
    };

    AttachmentListView.prototype.render = function() {
        var tiledAttachmentsEl = this.$el.find('.content-attachments-tiled');
        tiledAttachmentsEl.removeClass('content-attachments-1')
            .removeClass('content-attachments-2')
            .removeClass('content-attachments-3')
            .removeClass('content-attachments-4');
        var attachmentsCount = this.count();
        if (attachmentsCount) {
            tiledAttachmentsEl.addClass('content-attachments-' + attachmentsCount);
        }

        // Position images to be centered within their tile
        var fullWidth = this.$el.parents('.content').width();
        var halfWidth = fullWidth/2;
        if (this.count() > 1) {
            tiledAttachmentsEl.find('.content-attachment').css('height', halfWidth + 'px');
        } else {
            tiledAttachmentsEl.find('.content-attachment')
                .css('width', fullWidth + 'px')
                .css('height', fullWidth + 'px');
        }
    };

    /**
     * Add a Oembed attachment to the Attachments view. 
     * @param oembed {Oembed} A Oembed instance to render in the View
     * @returns {AttachmentListView} By convention, return this instance for chaining
     */
    AttachmentListView.prototype.add = function(oembed) { 
        var oembedView = this.createAttachmentView(oembed);
        oembedView.render();
        this.render();
        return this;
    };

    /**
     * Creates the view to render the oembed content object
     * @param oembed {Oembed} A Oembed instance to render in the View
     * @returns {OembedView} 
     */
    AttachmentListView.prototype.createAttachmentView = function(oembed) {
        var oembedView = new OembedView({
            oembed: oembed     
        });
        if (oembed.type == 'photo' || oembed.type == 'video') {
            oembedView.$el.appendTo(this.$el.find('.content-attachments-tiled'));
        } else {
            oembedView.$el.appendTo(this.$el.find('.content-attachments-stacked'));
        }
        this.oembedViews.push(oembedView);
        return oembedView;
    };

    /**
     * Remove a piece of Content from this ListView
     * @param content {Content|ContentView} The ContentView or Content to be removed
     * @returns {boolean} true if Content was removed, else false
     */
    AttachmentListView.prototype.remove = function (oembed) {
        var oembedView = oembed.el ? oembed : this.getOembedView(oembed); //duck type for ContentView
        if (! oembedView) {
            return false;
        }
        oembedView.$el.remove();
        // Remove from this.oembedViews[]
        this.oembedViews.splice(this.oembedViews.indexOf(oembedView), 1);
        this.render();
        return true;
    };

    /**
     * Given a new Content instance, return an existing contentView that
     * should be used to update the content (based on identity or content.id).
     * @param newContent {Content} The piece of content to find the view for.
     * @returns {ContentView | null} The contentView for the content, or null.
     */
    AttachmentListView.prototype.getOembedView = function (newOembed) {
        var existingOembedView;
        for (var i=0; i < this.oembedViews.length; i++) {
            var oembedView = this.oembedViews[i];
            if ((newOembed === oembedView.oembed) || (newOembed.id && oembedView.oembed.id === newOembed.id)) {
                return oembedView;
            }
        }
        return null;
    };

    /**
     * Gets the template rendering context. By default, returns "this.content".
     * @return {Content} The content object this view was instantiated with.
     */  
    AttachmentListView.prototype.getTemplateContext = function () {
        var context = $.extend({}, this);
        return context;
    };

    return AttachmentListView;
});
