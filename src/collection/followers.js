define([
    'inherits',
    'event-emitter'
], function (inherits, EventEmitter) {
    'use strict';

    /**
     * [Followers description]
     * @param {[type]} collection [description]
     */
    function Followers(collection) {
        EventEmitter.call(this);

        /**
         * Event buffer. Keeps data around until events are bound.
         * @type {Object}
         * @private
         */
        this._buffer = {};

        // Init bootstrap to handle initial set of followers.
        collection.initFromBootstrap(this._handleBootstrapInit.bind(this));

        // Get updater and listen for stream data.
        var updater = collection.getOrCreateUpdater();
        updater.on('streamData', this._handleStreamData.bind(this));
    }
    inherits(Followers, EventEmitter);

    /**
     * Handle bootstrap init data.
     * @param {?Object} err Possible error response.
     * @param {Object} initData Bootstrap init data.
     * @private
     */
    Followers.prototype._handleBootstrapInit = function (err, initData) {
        if (err) {
            return;
        }
        var headDocument = initData.headDocument;
        if ('followers' in headDocument) {
            this._sendEvent('followers', headDocument.followers);
        }
        this._stream();
    };

    /**
     * Handle stream data. Picks out followers if they exist and sends
     * individual "follower" events for each.
     * @param {Object} streamData Stream data.
     * @private
     */
    Followers.prototype._handleStreamData = function (streamData) {
        if (!('followers' in streamData)) {
            return;
        }
        var follower;
        for (var i=0; i<streamData.followers.length; i++) {
            follower = streamData.followers[i];
            this._sendEvent('follower', {
                id: follower.authorId,
                following: follower.following
            });
        }
    };

    /**
     * Send an event. If there are no listeners, add the event to the buffer
     * so that it can be emitted once there is a listener.
     * @param {string} name Event name.
     * @param {Object} data Event data.
     * @private
     */
    Followers.prototype._sendEvent = function (name, data) {
        if (this._listeners[name] && this._listeners[name].length) {
            return this.emit(name, data);
        }
        if (!this._buffer[name]) {
            this._buffer[name] = [];
        }
        this._buffer[name].push(data);
    };

    /**
     * Send missed events to listeners if there are any.
     * @param {string} name Event name to send missed events for.
     * @private
     */
    Followers.prototype._sendMissedEvents = function (name) {
        if (!this._buffer[name]) {
            return;
        }
        var evts = this._buffer[name];
        var evt = evts.pop();
        while (evt) {
            this._sendEvent(name, evt);
            evt = evts.pop();
        }
    };

    /**
     * Removes all items from the buffer.
     */
    Followers.prototype.clearBuffer = function () {
        this._buffer = {};
    };

    /**
     * Destroys the instance.
     */
    Followers.prototype.destroy = function () {
        this.removeAllListeners();
        this.clearBuffer();
    };

    /**
     * Send missed events to the event name that was added if there are some.
     * @override
     */
    Followers.prototype.on = function (name, fn) {
        EventEmitter.prototype.on.apply(this, arguments);
        this._sendMissedEvents(name);
    };

    return Followers;
});
