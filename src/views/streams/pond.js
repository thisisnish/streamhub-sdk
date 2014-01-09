define([
    'inherits',
    'stream/writable',
    'streamhub-sdk/content/views/content-list-view',
    'streamhub-sdk/debug'],
function (inherits, Writable, ContentListView, debug) {
    'use strict';


    var log = debug('streamhub-sdk/views/streams/pond');


    /**
     * A Duplex stream (Readable & Writable) that directly adds items to a
     * ContentListView after specified intervals of that view receiving
     * adding content.
     * Pond also maintains a LIFO stack such that previously emitted Content can
     * be stashed back into Pond so that it is re-read out later when needed.
     * @constructor
     * @param [opts] {object}
     * @param [opts.scoops] {number} The default number of items to add.
     * @param [opts.interval] {number} The number of items that need to be
     *      added to the view before this Pond adds another.
     */
    var Pond = function (opts) {
        opts = opts || {};
        this.SCOOPS = opts.scoops || this.SCOOPS;
        this._stack = [];
        this._requestMore = null;
        this._interval = opts.interval || 1;
        this._count = -1;//Works well for archived content, resets to 0
        this._written = [];
        this._contentListView = null;
        Writable.call(this, opts);
    };
    inherits(Pond, Writable);

    
    /**
     * The default number of scoops when no number is provided.
     * @type {!number} Should be greater than 0.
     */
    Pond.prototype.SCOOPS = 1;
    
    /**
     * Registers a ContentListView or subclass. Listens for added contentViews and
     * pushes an addition at the specified interval.
     * @param contentListView {!ContentListView}
     * @param [opts} {Object}
     */
    Pond.prototype.pipish = function(contentListView, opts) {
        this._contentListView = contentListView;
        this._contentListView.on('added', function (contentView) {
            if (!contentView) {
                return;
            }
            
            var index = this._written.indexOf(contentView.content);
            if (index < 0) {
                this._count++;
            } else {
                this._written.splice(index, 1);
            }
            
            if (this._count === this._interval) {
                this._count = 0;
                //Get index to specify where to add new content
                this._index = this._contentListView.views.indexOf(contentView) || 0;
                this.scoop();
            }
        }.bind(this));
    };

    /**
     * Adds 1 or the specified number of items.
     * @param [n] {number}
     */
    Pond.prototype.scoop = function (n) {
        this._scoops = n || this.SCOOPS;
        
        if (this._scoops >= 0) {
            this._fetchAndPush();
        }
    };


    /**
     * Required by Duplex subclasses.
     * This ensures that once the scoop count is reached, no more content
     * is pushed.
     * @private
     */
    Pond.prototype._write = function (chunk, doneWriting) {
        var self = this;
        log('_write', chunk);

        // Put on BOTTOM of the stack.
        // written stuff comes after all stacked stuff
        this._stack.unshift(chunk);

        // Save the doneWriting cb for later. We'll call it once this
        // new bottom of the stack is popped, and we need more data
        // from the Writable side of the duplex
        this._requestMore = function () {
            self._requestMore = null;
            doneWriting();
        };

        if (this._scoops >= 1) {
            this._fetchAndPush();
        } else {
            // Emit 'hold' to signify that there is data waiting, if only
            // the goal were increased. This is useful to render a 'show more'
            // button only if there is data in the buffer, and avoids a
            // show more button that, when clicked, does nothing but disappear
            this.emit('hold');
        }
    };


    /**
     * Fetch data from the internal stack (sync) and add it.
     * Or, if there is nothing in the stack, request more from the Writable
     * side of the duplex, which will eventually call this again.
     * @private
     */
    Pond.prototype._fetchAndPush = function () {
        // If there's data in the stack, pop, push it along, & decrement goal
        if (this._stack.length) {
            // There's stuff in the stack. Use it.
            this._scoops--;
            var content = this._stack.pop();
            this._written.push(content);
            this._contentListView.add(content, this._index);
        }

        // If there was no data, or we just pushed the last bit,
        // request more if possible
        if (this._stack.length === 0 &&
            typeof this._requestMore === 'function') {
            this._requestMore();
        }
    };


    return Pond;
});
