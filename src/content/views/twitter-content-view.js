define([
    'streamhub-sdk/content/views/content-view',
    'hgn!streamhub-sdk/content/templates/twitter',
    'streamhub-sdk/util',
    'streamhub-sdk/jquery'],
function (ContentView, TwitterContentTemplate, util, $) {
    
    /**
     * A view for rendering twitter content into an element.
     * @param opts {Object} The set of options to configure this view with (See ContentView).
     * @exports streamhub-sdk/content/views/twitter-content-view
     * @constructor
     */

    var TwitterContentView = function (opts) {
        ContentView.call(this, opts);
    };
    util.inherits(TwitterContentView, ContentView); 
    
    TwitterContentView.prototype.elClass += ' content-tweet ';
    TwitterContentView.prototype.template = TwitterContentTemplate;

    /**
     * Gets the template rendering context. By default, returns "this.content".
     * @return {Content} The content object this view was instantiated with.
     */  
    TwitterContentView.prototype.getTemplateContext = function () {
        var context = ContentView.prototype.getTemplateContext.call(this);
        context.author.twitterUsername = context.author.profileUrl.split('/').pop();
        return context;
    };

    TwitterContentView.prototype.attachHandlers = function () {
        ContentView.prototype.attachHandlers.call(this);

        var self = this;
        this.$el.on('imageError.hub', function(e, oembed) {
            self.attachmentsView.remove(oembed);
            if (!self.attachmentsView.count()) {
                self.$el.removeClass('content-with-image');
            }
        });
    };

    return TwitterContentView;
});
