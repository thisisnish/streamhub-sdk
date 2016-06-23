'use strict';

/**
 * A mixin that decorates an instance of ContentView 
 * to display as an Instgram Photo
 * This includes default behavior of removing itself if its image
 * fails to load.
 */
function asInstagramContentView(contentView, opts) {
    opts = opts || {};
    var elClass = opts.elClass || 'content-instagram';
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
        var provider = (attachment.provider_name || '').toLowerCase();
        if (provider === 'instagram' && /^https?:\/\/(www\.)?instagram\.com/.test(attachment.link)) {
            context.createdAtUrl = attachment.link;
        }
        return context;
    };

    contentView.events = contentView.events.extended({
        'imageError.hub': function (e, oembed) {
            this.remove();
        }
    });
};

module.exports = asInstagramContentView;
