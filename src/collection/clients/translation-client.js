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
        this._version = opts.version || 'v4';
        LivefyreHttpClient.call(this, opts);
    };

    inherits(LivefyreTranslationClient, LivefyreHttpClient);

    LivefyreTranslationClient.prototype._serviceName = 'bootstrap';

    /** @override */
    LivefyreTranslationClient.prototype._getHost = function (opts) {
        var environment = opts.environment || 'livefyre.com';
        var host = 'bootstrap.' + environment;
        if (isLocaldev(environment)) {
            host = 'bsserver.' + environment;
        }
        return host;
    };

    /**
     * Is the provided environment local dev?
     * @param {string=} env - Environment to check.
     * @return {boolean}
     */
    function isLocaldev(env) {
        return env === 'fyre' || env === 'fy.re';
    }

    /**
     * Fetches data from the livefyre translation service with the arguments given.
     * @param opts {Object} The livefyre collection options.
     * @param opts.network {string} The name of the network in the livefyre platform
     * @param opts.siteId {string} The livefyre siteId for the conversation
     * @param [opts.appType] {string} Optional type of the app.
     * @param [opts.environment] {string} Optional environment.
     * @param [opts.language] {string} Optional language to request translations for.
     * @param callback {function()} A callback that is called upon success/failure of the
     *     bootstrap request. Callback signature is "function(error, data)".
     */
    LivefyreTranslationClient.prototype.getTranslations = function (opts, callback) {
        opts = opts || {};
        callback = callback || function() {};

        var url = this._getUrlBase(opts) +
            '/api/' + this._version +
            '/configuration/' + opts.network +
            '/site/' + opts.siteId + '/';

        var requestOpts = {
            data: {
                'section': 'translations',
                'translations.lang_code': opts.language || window.navigator.language
            },
            url: url
        };

        if (opts.appType) {
            requestOpts.data['translations.app'] = opts.appType;
        }

        this._request(requestOpts, callback);
    };

    return LivefyreTranslationClient;
});
