'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to have a bounded visible set
 */
function asFacebookContentView(contentView, opts) {
    opts = opts || {};
    var elClass = opts.elClass || 'content-facebook';
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

    var oldFooterGetTemplateContext = contentView._footerView.getTemplateContext;
    contentView._footerView.getTemplateContext = function () {
        var context = oldFooterGetTemplateContext.apply(contentView._footerView, arguments);
        if (!context.attachments || !context.attachments.length) {
            return context;
        }
        var attachment = context.attachments[0];
        var provider = attachment.provider_name.toLowerCase();
        if (provider === 'facebook' && /^https?:\/\/(www\.)?facebook\.com/.test(attachment.link)) {
            context.createdAtUrl = attachment.link;
        }
        return context;
    };
};

module.exports = asFacebookContentView;
