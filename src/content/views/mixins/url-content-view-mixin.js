var UrlContentHeaderView = require('streamhub-sdk/content/views/url-content-header-view');

'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have a bounded visible set
 */
function asUrlContentView(contentView, opts) {
    opts = opts || {};
    var elClass = opts.elClass || 'content-url';
    contentView.$el.addClass(elClass);


    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    var oldRender = contentView.render;
    contentView.render = function () {
        contentView._headerView.destroy();
        var headerView = new UrlContentHeaderView(opts);
        contentView._headerView = contentView._childViews[0] = headerView;

        oldRender.apply(contentView, arguments);
        contentView.$el.addClass(elClass);
    };
};

module.exports = asUrlContentView;
