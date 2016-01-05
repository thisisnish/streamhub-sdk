define([
    'inherits',
    'event-emitter'
], function (inherits, EventEmitter) {
    'use strict';

    /**
     * Service for retrieving all followers for a collection and handling them
     * as they stream in.
     * @constructor
     * @extends {EventEmitter}
     * @param {streamhub-sdk/collection/main} collection
     */
    function Followers(collection) {
        EventEmitter.call(this);

        /**
         * Collection object.
         * @type {streamhub-sdk/collection/main}
         * @private
         */
        this._collection = collection;

        /**
         * Whether the collection has been initialized and the stream has been
         * set up yet.
         * @type {boolean}
         * @private
         */
        this._collectionInitialized = false;
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
            throw new Error('Bootstrap init failed.');
        }
        var headDocument = initData.headDocument;
        if ('followers' in headDocument) {
            this.emit('followers', headDocument.followers.map(function (f) {
                return { id: f, following: true };
            }));
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
            this.emit('followers', [{
                id: follower.authorId,
                following: follower.following
            }]);
        }
    };

    /**
     * Destroys the instance.
     */
    Followers.prototype.destroy = function () {
        this.removeAllListeners();
    };

    /**
     * Send missed events to the event name that was added if there are some.
     * @override
     */
    Followers.prototype.on = function (name, fn) {
        EventEmitter.prototype.on.apply(this, arguments);

        // Only start streaming data the first time an event is bound.
        if (this._collectionInitialized) {
            return;
        }

        // Init bootstrap to handle initial set of followers.
        this._collection.initFromBootstrap(this._handleBootstrapInit.bind(this));

        // Get updater and listen for stream data.
        var updater = this._collection.getOrCreateUpdater();
        updater.on('streamData', this._handleStreamData.bind(this));

        this._collectionInitialized = true;
    };

    return Followers;
});
