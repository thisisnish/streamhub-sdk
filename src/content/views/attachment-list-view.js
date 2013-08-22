define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/view',
    'streamhub-sdk/content/views/oembed-view',
    'hgn!streamhub-sdk/content/templates/attachment-list',
    'streamhub-sdk/util'],
function($, View, OembedView, AttachmentListTemplate, util) {
    
    /**
     * A simple View that displays Content in a list (`<ul>` by default).
     * @param opts {Object} A set of options to config the view with
     * @param opts.el {HTMLElement} The element in which to render the streamed content
     * @exports streamhub-sdk/views/list-view
     * @constructor
     */
    var AttachmentListView = function(opts) {
        opts = opts || {};
        this.content = opts.content;
        this.oembedViews = [];
        View.call(this, opts);

        if (this.content) {
            for (var i=0; i < this.content.attachments.length; i++) {
                this.add(this.content.attachments[i]);
            }
        }

    };
    util.inherits(AttachmentListView, View);

    AttachmentListView.prototype.initialize = function() {
        var self = this;
        if (this.content) {
            this.content.on('attachment', function(attachment) {
                self.$el.trigger('initModal.hub');
                self.add(attachment);
            });
        }
    };

    AttachmentListView.prototype.template = AttachmentListTemplate;
    AttachmentListView.prototype.tiledAttachmentsSelector = '.content-attachments-tiled';
    AttachmentListView.prototype.stackedAttachmentsSelector = '.content-attachments-stacked';
    AttachmentListView.prototype.squareTileClassName = 'content-attachment-square-tile';
    AttachmentListView.prototype.horizontalTileClassName = 'content-attachment-horizontal-tile';
    AttachmentListView.prototype.contentAttachmentSelector = '.content-attachment';

    /**
     * Set the element for the view to render in.
     * You will probably want to call .render() after this, but not always.
     * @param element {HTMLElement} The element to render this View in
     * @return this
     */
    AttachmentListView.prototype.setElement = function (element) {
        this.el = element;
        this.$el = $(element);
        this.$el.html(this.template());
        return this;
    };

    /**
     * A count of the number of attachments for this content item
     * @returns {int} The number of attachments for this content item
     */
    AttachmentListView.prototype.count = function() {
        return this.oembedViews.length;
    };

    AttachmentListView.prototype.tileableCount = function() {
        var attachmentsCount = 0;
        for (var i=0; i < this.oembedViews.length; i++) {
            if (this.isAttachmentTileable(this.oembedViews[i])) {
                attachmentsCount++;
            }
        }
        return attachmentsCount;
    };

    AttachmentListView.prototype.isAttachmentTileable = function (oembed) {
        var oembedView = oembed.el ? oembed : this.getOembedView(oembed); //duck type for ContentView
        if (! oembedView) {
            return false;
        }
        if (oembedView.oembed.type === 'photo' || oembedView.oembed.type === 'video') {
            return true;
        }
        return false;
    };

    /**
     * Renders the template and appends itself to this.el
     */
    AttachmentListView.prototype.render = function() {
        var tiledAttachmentsEl = this.$el.find('.content-attachments-tiled');
        tiledAttachmentsEl.removeClass('content-attachments-1')
            .removeClass('content-attachments-2')
            .removeClass('content-attachments-3')
            .removeClass('content-attachments-4');
        var attachmentsCount = this.tileableCount();
        if (attachmentsCount && attachmentsCount <= 4) {
            // Only tile for <= 4 photo or video attachments
            tiledAttachmentsEl.addClass('content-attachments-' + attachmentsCount);
        }
        tiledAttachmentsEl.find(this.contentAttachmentSelector).addClass(this.squareTileClassName);
        if (attachmentsCount == 3) {
            tiledAttachmentsEl.find(this.contentAttachmentSelector + ':first')
                .removeClass(this.squareTileClassName)
                .addClass(this.horizontalTileClassName);
        } else if (attachmentsCount > 4) {
            tiledAttachmentsEl.find(this.contentAttachmentSelector)
                .removeClass(this.squareTileClassName)
                .addClass(this.horizontalTileClassName);
        } else {
            tiledAttachmentsEl.find(this.contentAttachmentSelector)
                .removeClass(this.horizontalTileClassName)
                .addClass(this.squareTileClassName);
        }
    };

    /**
     * Add a Oembed attachment to the Attachments view. 
     * @param oembed {Oembed} A Oembed instance to render in the View
     * @returns {AttachmentListView} By convention, return this instance for chaining
     */
    AttachmentListView.prototype.add = function(oembed) { 
        var oembedView = this.createOembedView(oembed);

        var tiledAttachmentsEl = this.$el.find(this.tiledAttachmentsSelector);
        var self = this;
        if (this.isAttachmentTileable(oembed)) {
            oembedView.$el.appendTo(tiledAttachmentsEl);
            oembedView.$el.on('click', function(e) {
                $(e.target).trigger('focusContent.hub', { content: self.content, focusedAttachmentView: oembedView });
            });
        } else {
            oembedView.$el.appendTo(this.$el.find(this.stackedAttachmentsSelector));
        }

        oembedView.render();
        this.render();

        return this;
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
     * Creates the view to render the oembed content object
     * @param oembed {Oembed} A Oembed instance to render in the View
     * @returns {OembedView} 
     */
    AttachmentListView.prototype.createOembedView = function(oembed) {
        var oembedView = new OembedView({
            oembed: oembed     
        });
        this.oembedViews.push(oembedView);
        return oembedView;
    };

    /**
     * Given a new Content instance, return an existing contentView that
     * should be used to update the content (based on identity or content.id).
     * @param newOembed {Content} The piece of content to find the view for.
     * @returns {OembedView | null} The oembedView for the content, or null.
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

    return AttachmentListView;
});
