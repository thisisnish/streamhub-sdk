define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/view',
    'streamhub-sdk/content/content-view-factory',
    'streamhub-sdk/modal/views/attachment-gallery-modal',
    'inherits',
    'streamhub-sdk/debug',
    'stream/writable',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/views/streams/more',
    'streamhub-sdk/views/show-more-button',
    'hgn!streamhub-sdk/views/templates/list-view'],
function($, View, ContentViewFactory, AttachmentGalleryModal, inherits,
debug, Writable, ContentView, More, ShowMoreButton, ListViewTemplate) {
    'use strict';

    var log = debug('streamhub-sdk/views/base-list-view');

    /**
     * A simple View that displays Content in a list (`<ul>` by default).
     *
     * @param opts {Object} A set of options to config the view with
     * @param opts.el {HTMLElement} The element in which to render the streamed content
     * @exports streamhub-sdk/views/list-view
     * @constructor
     */
    var ListView = function(opts) {
        opts = opts || {};

        this.views = [];

        View.call(this, opts);
        Writable.call(this, opts);
        this.render();
    };

    inherits(ListView, View);
    inherits.parasitically(ListView, Writable);


    ListView.prototype.setElement = function (element) {
        View.prototype.setElement.apply(this, arguments);
        this.$listEl = this.$el;
    };


    /**
     * @private
     * Called automatically by the Writable base class when .write() is called
     * @param view {View} View to display in the ListView
     * @param requestMore {function} A function to call when done writing, so
     *     that _write will be called again with more data
     */
    ListView.prototype._write = function (view, requestMore) {
        this.add(view);
        requestMore();
    };


    /**
     * @private
     * Comparator function to determine ordering of Views.
     * Your subclass should implement this if you want ordering
     * @param a {view}
     * @param b {view}
     * @returns {Number} < 0 if a before b, 0 if same ordering, > 0 if b before a
     */
    ListView.prototype.comparator = null


    /**
     * Add a view to the ListView
     *     insert the newView into this.el according to this.comparator
     * @param newView {View} A View to add to the ListView
     * @returns the newly added View
     */
    ListView.prototype.add = function(newView) {
        log("add", newView);

        if ( ! newView) {
            log("Called add with a falsy parameter, returning");
            return;
        }

        // Push and sort. #TODO Insert in sorted order
        if (this.views.indexOf(newView) === -1) {
            this.views.push(newView);
        }

        if (this.comparator) {
            this.views.sort(this.comparator);
        }

        // Add to DOM
        this._insert(newView);

        return newView;
    };


    /**
     * Remove a View from this ListView
     * @param content {Content|ContentView} The ContentView or Content to be removed
     * @returns {boolean} true if Content was removed, else false
     */
    ListView.prototype.remove = function (view) {
        var viewIndex = this.views.indexOf(view);

        // Return false if the provided view is not managed by this ListView
        if (viewIndex === -1) {
            return false;
        }

        // Remove from DOM
        this._extract(view);

        // Remove from this.views[]
        this.views.splice(viewIndex, 1);

        return true;
    };


    /**
     * @private
     * Remove a view from the DOM. Called by .remove();
     * @param view {View} The View to remove from the DOM
     */
    ListView.prototype._extract = function (view) {
        view.$el.remove();
    };


    /**
     * Insert a contentView into the ListView's .el
     * Get insertion index based on this.comparator
     * @private
     */
    ListView.prototype._insert = function (view) {
        var newContentViewIndex,
            $previousEl;

        newContentViewIndex = this.views.indexOf(view);

        if (newContentViewIndex === 0) {
            // Beginning!
            view.$el.prependTo(this.$listEl);
        } else {
            // Find it's previous view and insert new view after
            $previousEl = this.views[newContentViewIndex - 1].$el;
            view.$el.insertAfter($previousEl);
        }
    };


    return ListView;
});
