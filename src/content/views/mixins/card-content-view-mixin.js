'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have default card theme
 */
function asCardContentView(contentView, opts) {
    opts = opts || {};
    var elClass = opts.elClass || 'content-default';
    contentView.$el.addClass(elClass);

    /**
     * Render the content inside of the LivefyreContentView's element.
     */
    var oldRender = contentView.render;
    contentView.render = function () {
        oldRender.apply(contentView, arguments);
        contentView.$el.addClass(elClass);
    };
};

module.exports = asCardContentView;
