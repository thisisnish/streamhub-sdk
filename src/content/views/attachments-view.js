define(['streamhub-sdk/jquery', 'streamhub-sdk/content/views/oembed-view'],
function($, OembedView) {
    
    /**
     * A simple View that displays Content in a list (`<ul>` by default).
     * @param opts {Object} A set of options to config the view with
     * @param opts.el {HTMLElement} The element in which to render the streamed content
     * @exports streamhub-sdk/views/list-view
     * @constructor
     */
    var AttachmentsView = function(opts) {
        opts = opts || {};
        this.attachments = opts.attachments || [];
        this.setElement(opts.el || document.createElement(this.elTag));
        this.oembedViews = [];
    };

    AttachmentsView.prototype.elTag = 'div';
    
    /**
     * Set the element for the view to render in.
     * You will probably want to call .render() after this, but not always.
     * @param element {HTMLElement} The element to render this View in
     * @return this
     * @param
     */
    AttachmentsView.prototype.setElement = function (element) {
        this.el = element;
        this.$el = $(element);

        return this;
    };

    AttachmentsView.prototype.count = function() {
        return this.oembedViews.length;
    };

    AttachmentsView.prototype.render = function() {
        this.$el[0].className = 'content-attachments';
        var attachmentsCount = this.count();
        if (attachmentsCount) {
            this.$el.addClass('content-attachments-' + attachmentsCount);
        }
    };

    /**
     * Add a Oembed attachment to the Attachments view. 
     * @param oembed {Oembed} A Oembed instance to render in the View
     * @returns {AttachmentsView} By convention, return this instance for chaining
     */
    AttachmentsView.prototype.add = function(oembed) { 
        var oembedEl = $('<div></div>');
        this.$el.append(oembedEl);
        var oembedView = new OembedView({
            el: oembedEl,
            oembed: oembed     
        });
        this.oembedViews.push(oembedView);
        this.render();
        oembedView.render();
        return this;
    };

    /**
     * Remove a piece of Content from this ListView
     * @param content {Content|ContentView} The ContentView or Content to be removed
     * @returns {boolean} true if Content was removed, else false
     */
    AttachmentsView.prototype.remove = function (oembed) {
        var oembedView = oembed.el ? oembed : this.getOembedView(oembed); //duck type for ContentView
        if (! oembedView) {
            return false;
        }
        oembedView.$el.remove();
        // Remove from this.contentViews[]
        this.oembedViews.splice(this.oembedViews.indexOf(oembedView), 1);
        this.render();
        oembedView.render();
        return true;
    };

    /**
     * Given a new Content instance, return an existing contentView that
     * should be used to update the content (based on identity or content.id).
     * @param newContent {Content} The piece of content to find the view for.
     * @returns {ContentView | null} The contentView for the content, or null.
     */
    AttachmentsView.prototype.getOembedView = function (newOembed) {
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
    AttachmentsView.prototype.getTemplateContext = function () {
        var context = $.extend({}, this);
        return context;
    };

    return AttachmentsView;
});
