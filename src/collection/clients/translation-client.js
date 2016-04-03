define([
    'streamhub-sdk/collection/clients/http-client',
    'inherits',
    'urnlib'],
function(LivefyreHttpClient, inherits, urnlib) {
    'use strict';

    /**
     * A Client for requesting Livefyre's Translation Service
     * @exports streamhub-sdk/collection/clients/translation-client
     */
    var LivefyreTranslationClient = function (opts) {
        opts = opts || {};
        opts.serviceName = 'bootstrap';
        this._version = opts.version || 'v4';
        LivefyreHttpClient.call(this, opts);
    };

    inherits(LivefyreTranslationClient, LivefyreHttpClient);

    LivefyreTranslationClient.prototype._serviceName = 'bootstrap';

    /**
     * Fetches data from the livefyre translation service with the arguments given.
     * @param opts {Object} The livefyre collection options.
     * @param opts.network {string} The name of the network in the livefyre platform
     * @param opts.siteId {string} The livefyre siteId for the conversation
     * @param [opts.environment] {string} Optional livefyre environment to use dev/prod environment
     * @param [opts.version] {string} Version string to include in Bootstrap API
     *     resource paths. By default, one will not be added, which usually means '3.0'
     * @param callback {function} A callback that is called upon success/failure of the
     *     bootstrap request. Callback signature is "function(error, data)".
     */
    LivefyreTranslationClient.prototype.getTranslations = function(opts, callback) {
        opts = opts || {};
        callback = callback || function() {};
        var scopeUrn = new urnlib.URN([
            [null, opts.network],
            ['site', opts.siteId],
            [null, 'translationsets']
        ]);
        var environment = opts.environment || 'livefyre.com';
        if (environment === 'fyre' || environment === 'fy.re') {
            opts.network = 'fyre';
        }
        var url = [
            this._getUrlBase(opts),
            '/api/',
            this._version ? this._version + '/' : '',
            scopeUrn.toString()
        ].join('');

        var requestOpts = {url: url};

        if (opts.appType) {
            requestOpts.data = {app_type: opts.appType};
        }

        this._request(requestOpts, callback);
    };

    return LivefyreTranslationClient;
});
