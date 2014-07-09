var template = require('hgn!streamhub-sdk/content/templates/url-content-header');

'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have a bounded visible set
 */
function asUrlContentHeaderView(contentView, opts) {
    opts = opts || {};
    var elClass = opts.elClass || 'content-url';
    contentView.$el.addClass(elClass);

    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    var oldRender = contentView.render;
    contentView.render = function () {
        oldRender.apply(contentView, arguments);
        contentView.$el.addClass(elClass);
    };
    contentView.template = template;
};

module.exports = asUrlContentHeaderView;
