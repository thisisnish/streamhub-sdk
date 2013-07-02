define([
	'streamhub-sdk/content/views/content-view',
	'hgn!streamhub-sdk/content/templates/twitter',
	'streamhub-sdk/jquery'],
function (ContentView, TwitterContentTemplate, $) {
	
    /**
     * A view for rendering twitter content into an element.
     * @param opts {Object} The set of options to configure this view with (See ContentView).
     * @exports streamhub-sdk/content/views/twitter-content-view
     * @constructor
     */

	var TwitterContentView = function TwitterContentView (opts) {
		ContentView.call(this, opts);
	};
	
	TwitterContentView.prototype = new ContentView();
	
	TwitterContentView.prototype.elClass += ' content-tweet ';
	TwitterContentView.prototype.template = TwitterContentTemplate;
	TwitterContentView.prototype.tooltipElSelector = '.hub-tooltip-link';

	TwitterContentView.prototype.setElement = function (element) {
		ContentView.prototype.setElement.call(this, element);
		this.attachHandlers();
		return this;
	};

	TwitterContentView.prototype.attachHandlers = function () {
		var self = this;
		this.$el.on('mouseenter', this.tooltipElSelector, function (e) {
            var title = $(this).attr('title');
            var position = $(this).position();
            var positionWidth = $(this).width();

            var tooltip = "<div class=\"hub-current-tooltip content-action-tooltip\"><div class=\"content-action-tooltip-bubble\">" + title + "</div><div class=\"content-action-tooltip-tail\"></div></div>";
            $(this).parent().append(tooltip);

            var tooltipOffset = $(this).offset();

            var $currentTooltip = self.$el.find('.hub-current-tooltip');

            var tooltipWidth = $currentTooltip.width();
            var tooltipHeight = $currentTooltip.height();

            $currentTooltip.css({
                "left": position.left + (positionWidth / 2) - (tooltipWidth / 2),
                "top":  position.top - tooltipHeight - 2
            });

            if ($(this).hasClass('tooltip-twitter')){
                var currentLeft = parseInt($currentTooltip.css('left'));
                $currentTooltip.css('left', currentLeft + 7);
            }

            $currentTooltip.fadeIn();
		});
		this.$el.on('mouseleave', this.tooltipElSelector, function (e) {
			var $current = self.$el.find('.hub-current-tooltip');
            $current.removeClass('hub-current-tooltip').fadeOut(200, function(){
                $(this).remove();
            });
		});
		return this;
	}

	return TwitterContentView;
});