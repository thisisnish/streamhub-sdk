'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have a bounded visible set
 */
function asUrlContentHeaderView(contentView, opts) {
    opts = opts || {};
    var elClass = opts.elClass || 'content-url';
    contentView.$el.addClass(elClass);

    var oldRender = contentView.render;
    contentView.render = function () {
        oldRender.apply(contentView, arguments);
        contentView.$el.addClass(elClass);
    };
};

module.exports = asUrlContentHeaderView;
