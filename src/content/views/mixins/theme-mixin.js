'use strict';

function hasTheme(contentView, themeClassName) {
    if (! themeClassName) {
        return;
    }

    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    var oldRender = contentView.render;
    contentView.render = function () {
        oldRender.apply(contentView, arguments);
        contentView.$el.addClass(themeClassName);
    };
};

module.exports = hasTheme;
