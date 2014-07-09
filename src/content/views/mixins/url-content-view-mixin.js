'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have a bounded visible set
 */
function asUrlContentView(contentView, opts) {
    opts = opts || {};
    var elClass = opts.elClass;
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
};

module.exports = asUrlContentView;
