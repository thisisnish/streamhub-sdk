define([
    'streamhub-sdk/jquery',
    'base64'],
    function($) {
    'use strict';

    /**
     * A Client for requesting Livefyre's Bootstrap Service
     * @exports streamhub-sdk/collection/clients/bootstrap-client
     */
    var LivefyreBootstrapClient = function (opts) {
        opts = opts || {};
        this._protocol = opts.protocol || 'http';
    };

    /**
     * Fetches data from the livefyre bootstrap service with the arguments given.
     * @param opts {Object} The livefyre collection options.
     * @param opts.network {string} The name of the network in the livefyre platform
     * @param opts.siteId {string} The livefyre siteId for the conversation
     * @param opts.articleId {string} The livefyre articleId for the conversation
     * @param [opts.page] {string} Livefyre page name or number to fetch from bootstrap
     *     (default "init")
     * @param [opts.environment] {string} Optional livefyre environment to use dev/prod environment
     * @param callback {function} A callback that is called upon success/failure of the
     *     bootstrap request. Callback signature is "function(error, data)".
     */
    LivefyreBootstrapClient.prototype.getContent = function(opts, callback) {
        var isLocaldev;
        opts = opts || {};
        callback = callback || function() {};
        opts.environment = opts.environment || 'livefyre.com';
        isLocaldev = opts.environment && opts.environment === 'fyre';

        var url = [
            this._getUrlBase(opts),
            "/bs3/",
            (opts.environment && ! isLocaldev) ? opts.environment + "/" : "",
            opts.network,
            "/",
            opts.siteId,
            "/",
            btoa(opts.articleId),
            "/",
            typeof opts.page !== 'undefined' ? opts.page+'.json' : "init"
        ].join("");

        $.ajax({
            type: "GET",
            url: url,
            dataType: this._getDataType(),
            success: function(data, status, jqXhr) {
                // todo: (genehallman) check livefyre stream status in data.status
                callback(null, data);
            },
            error: function(jqXhr, status, err) {
                callback(err);
            }
        });
    };

    /**
     * Get the $.ajax dataType to use
     */
    LivefyreBootstrapClient.prototype._getDataType = function () {
        if ($.support.cors && this._protocol === 'http') {
            return 'json';
        }
        return 'jsonp';
    };

    /**
     * Get the base of the URL (protocol and hostname)
     */
    LivefyreBootstrapClient.prototype._getUrlBase = function (opts) {
        return [
            this._protocol,
            '://',
            this._getHost(opts)
        ].join('');
    };

    /**
     * Get the host of the URL
     */
    LivefyreBootstrapClient.prototype._getHost = function (opts) {
        var isLivefyreNetwork = (opts.network === 'livefyre.com');
        var host = 'bootstrap.' + (isLivefyreNetwork ? opts.environment : opts.network);
        var hostParts;
        if (! isLivefyreNetwork && this._protocol=='https') {
            hostParts = opts.network.split('.');
            // Make like 'customer.bootstrap.fyre.co'
            hostParts.splice(1,0,'bootstrap');
            host = hostParts.join('.');
        }
        return host;
    };

    return LivefyreBootstrapClient;

});