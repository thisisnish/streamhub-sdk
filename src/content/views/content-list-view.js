define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/views/list-view',
    'streamhub-sdk/content/content-view-factory',
    'streamhub-sdk/modal/views/attachment-gallery-modal',
    'inherits',
    'streamhub-sdk/debug',
    'stream/writable',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/views/streams/more',
    'streamhub-sdk/views/show-more-button',
    'hgn!streamhub-sdk/views/templates/list-view'],
function($, ListView, ContentViewFactory, AttachmentGalleryModal, inherits,
debug, Writable, ContentView, More, ShowMoreButton, ContentListViewTemplate) {
    'use strict';

    var log = debug('streamhub-sdk/views/list-view');

    /**
     * A simple View that displays Content in a list (`<ul>` by default).
     *
     * @param opts {Object} A set of options to config the view with
     * @param opts.el {HTMLElement} The element in which to render the streamed content
     * @exports streamhub-sdk/views/list-view
     * @constructor
     */
    var ContentListView = function(opts) {
        opts = opts || {};

        this._moreAmount = opts.showMore || 50;
        this.more = opts.more || this._createMoreStream(opts);
        this.showMoreButton = opts.showMoreButton || this._createShowMoreButton(opts);
        this.showMoreButton.setMoreStream(this.more);

        this.modal = opts.modal === undefined ? new AttachmentGalleryModal() : opts.modal;
        this.contentViewFactory = new ContentViewFactory();

        ListView.call(this, opts);

        this.more.pipe(this, { end: false });
    };

    inherits(ContentListView, ListView);


    ContentListView.prototype.template = ContentListViewTemplate;

    /**
     * Class property to add to ListView instances' .el
     */
    ContentListView.prototype.elClass += ' streamhub-list-view';

    /**
     * Selector of .el child that contentViews should be inserted into
     */
    ContentListView.prototype.listElSelector = '.content-list';
    /**
     * Selector of .el child in which to render a show more button
     */
    ContentListView.prototype.showMoreElSelector = '.content-list-more';


    /**
     * Set the element that this ContentListView renders in
     * @param element {HTMLElement} The element to render the ContentListView in
     */
    ContentListView.prototype.setElement = function (element) {
        var self = this;
        ListView.prototype.setElement.apply(this, arguments);

        // .showMoreButton will trigger showMore.hub when it is clicked
        this.$el.on('showMore.hub', function () {
            self.showMore();
        });

        this.$el.on('removeContentView.hub', function(e, content) {
            self.remove(content);
        });
        this.$el.on('focusContent.hub', function(e, context) {
            var contentView = self.getContentView(context.content);
            if (! self.modal) {
                if (contentView &&
                    contentView.attachmentsView &&
                    typeof contentView.attachmentsView.focus === 'function') {
                    contentView.attachmentsView.focus(context.attachmentToFocus);
                }
                return;
            }
            self.modal.show(context.content, { attachment: context.attachmentToFocus });
        });
    };


    /**
     * Render the ContentListView in its .el, and call .setElement on any subviews
     */
    ContentListView.prototype.render = function () {
        ListView.prototype.render.call(this);
        this.$listEl = this.$el.find(this.listElSelector);

        this.showMoreButton.setElement(this.$el.find(this.showMoreElSelector));
        this.showMoreButton.render();
    };


    /**
     * @private
     * Create a Stream that extra content can be written into.
     * This will be used if an opts.moreBuffer is not provided on construction.
     * By default, this creates a streamhub-sdk/views/streams/more
     */
    ContentListView.prototype._createMoreStream = function (opts) {
        opts = opts || {};
        return new More({
            highWaterMark: 0,
            goal: opts.initial || 50
        });
    };


    /**
     * @private
     * Create a ShowMoreButton view to be used if one is not passed as
     *     opts.showMoreButton on construction
     * @return {ShowMoreButton}
     */
    ContentListView.prototype._createShowMoreButton = function (opts) {
        return new ShowMoreButton();
    };


    /**
     * @private
     * Comparator function to determine ordering of ContentViews.
     * ContentView elements indexes in this.el will be ordered by this
     * By default, order on contentView.content.createdAt or contentView.createdAt
     *     in descending order (new first)
     * @param a {ContentView}
     * @param b {ContentView}
     * @returns {Number} < 0 if a before b, 0 if same ordering, > 0 if b before a
     */
    ContentListView.prototype.comparator = function (a, b) {
        var aDate = a.content.createdAt || a.createdAt,
            bDate = b.content.createdAt || b.createdAt;
        return bDate - aDate;
    };


    /**
     * Add a piece of Content to the ContentListView
     *     .createContentView(content)
     *     add newContentView to this.contentViews[]
     *     render the newContentView
     *     insert the newContentView into this.el according to this.comparator
     * @param content {Content} A Content model to add to the ContentListView
     * @returns the newly created ContentView
     */
    ContentListView.prototype.add = function(content) {
        var contentView = this.getContentView(content);

        log("add", content);

        if (contentView) {
            return contentView;
        }

        contentView = this.createContentView(content);

        return ListView.prototype.add.call(this, contentView);
    };


    /**
     * Show More content.
     * ContentListView keeps track of an internal ._newContentGoal
     *     which is how many more items he wishes he had.
     *     This increases that goal and marks the Writable
     *     side of ContentListView as ready for more writes.
     * @param numToShow {number} The number of items to try to add
     */
    ContentListView.prototype.showMore = function (numToShow) {
        if (typeof numToShow === 'undefined') {
            numToShow = this._moreAmount;
        }
        this.more.setGoal(numToShow);
    };


    /**
     * Remove a piece of Content from this ContentListView
     * @param content {Content|ContentView} The ContentView or Content to be removed
     * @returns {boolean} true if Content was removed, else false
     */
    ContentListView.prototype.remove = function (content) {
        var contentView = content.el ? content : this.getContentView(content); //duck type for ContentView
        return ListView.prototype.remove.call(this, contentView);
    };


    /**
     * Given a new Content instance, return an existing contentView that
     * should be used to update the content (based on identity or content.id).
     * @param newContent {Content} The piece of content to find the view for.
     * @returns {ContentView | null} The contentView for the content, or null.
     */
    ContentListView.prototype.getContentView = function (newContent) {
        for (var i=0; i < this.views.length; i++) {
            var contentView = this.views[i];
            if ((newContent === contentView.content) || (newContent.id && contentView.content.id === newContent.id)) {
                return contentView;
            }
        }
        return null;
    };


    /**
     * Creates a content view from the given piece of content, by looking in this view's
     * content registry for the supplied content type.
     * @param content {Content} A content object to create the corresponding view for.
     * @returns {ContentView} A new content view object for the given piece of content.
     */
    ContentListView.prototype.createContentView = function (content) {
        var view = this.contentViewFactory.createContentView(content);

        if (view && typeof view.render === 'function') {
            view.render();
        }

        return view;
    };


    return ContentListView;
});
