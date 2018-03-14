define([
    'streamhub-sdk/collection/clients/http-client',
    'inherits'],
function(LivefyreHttpClient, inherits) {
    'use strict';

    /**
     * A Client for requesting Livefyre's Stream Service
     * @exports streamhub-sdk/collection/clients/stream-client
     */
    var LivefyreStreamClient = function (opts) {
        opts = opts || {};
        opts.serviceName = 'stream1';
        this._version = opts.version || 'v3.1';
        LivefyreHttpClient.call(this, opts);
    };
    inherits(LivefyreStreamClient, LivefyreHttpClient);

    LivefyreStreamClient.prototype._serviceName = 'stream1';

    /**
     * Get data for the stream request params.
     * @param {Object} opts Content request config.
     * @returns {Object}
     * @private
     */
    LivefyreStreamClient.prototype._getData = function (opts) {
        return {multi: true};
    };

    /**
     * Do not want to send `X-DNT` header to the stream server.
     * @override
     */
    LivefyreStreamClient.prototype._getHeaders = function (opts) {
        var headers = LivefyreHttpClient.prototype._getHeaders.call(this, opts);
        delete headers['X-DNT'];
        return headers;
    };

    /**
     * Get the generated stream path.
     * @param {Object} opts Content request config.
     * @returns {string}
     * @private
     */
    LivefyreStreamClient.prototype._getPath = function (opts) {
        return [
            this._getUrlBase(opts),
            '/',
            this._version,
            '/collection/',
            opts.collectionId,
            '/',
            opts.commentId || '0',
            '/'
        ].join('');
    };

    /**
     * Fetches content from the livefyre conversation stream with the supplied arguments.
     * @param opts {Object} The livefyre collection options.
     * @param opts.network {string} The name of the network in the livefyre platform
     * @param opts.collectionId {string} The livefyre collectionId for the conversation stream
     * @param opts.commentId {?string} The commentId to fetch content from (default "0")
     * @param callback {function} A callback that is called upon success/failure of the
     * stream request. Callback signature is "function(error, data)".
     */
    LivefyreStreamClient.prototype.getContent = function(opts, callback) {
        opts = opts || {};
        callback = callback || function() {};

        return this._request({
            data: this._getData(opts),
            url: this._getPath(opts)
        }, function (err, data) {
            if (err) {
                return callback.apply(this, arguments);
            }

            if (!Array.isArray(data)) {
                data = [data];
            }

            data.forEach(function (datum) {
                if (datum.timeout) {
                    return callback(null, { timeout: datum.timeout });
                }
                if (datum.status === 'error') {
                    return callback(datum.msg);
                }
                callback(null, datum.data);
            });
        });
    };

    return LivefyreStreamClient;
});
