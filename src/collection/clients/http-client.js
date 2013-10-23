define(['streamhub-sdk/jquery'], function($) {
    'use strict';

    /**
     * A Client for requesting Livefyre web services
     * This is private and should not be used or imported directly
     * @exports streamhub-sdk/collection/clients/bootstrap-client
     */
    var LivefyreHttpClient = function (opts) {
        opts = opts || {};
        this._serviceName = opts.serviceName;
        this._protocol = opts.protocol || 'http';
    };

    /**
     * Make an HTTP Request
     */
    LivefyreHttpClient.prototype._request = function (opts, callback) {
        $.ajax({
            type: opts.method || 'GET',
            url: opts.url,
            data: opts.data,
            dataType: this._getDataType(opts),
            success: function(data, status, jqXhr) {
                // todo: (genehallman) check livefyre stream status in data.status
                callback(null, data);
            },
            error: function(jqXhr, status, err) {
                if (windowIsUnloading) {
                    // Error fires when the user reloads the page during a long poll,
                    // But we don't want to throw an exception if the page is
                    // going away anyway.
                    return;
                }
                if ( ! err) {
                    err = "LivefyreHttpClient Error";
                }
                callback(err);
            }
        });
    };

    /**
     * Get the $.ajax dataType to use
     */
    LivefyreHttpClient.prototype._getDataType = function (opts) {
        if (opts.dataType) {
            return opts.dataType;
        }
        if ($.support.cors && this._protocol === 'http') {
            return 'json';
        }
        return 'jsonp';
    };

    /**
     * Get the base of the URL (protocol and hostname)
     */
    LivefyreHttpClient.prototype._getUrlBase = function (opts) {
        return [
            this._protocol,
            '://',
            this._getHost(opts)
        ].join('');
    };

    /**
     * Get the host of the URL
     */
    LivefyreHttpClient.prototype._getHost = function (opts) {
        var isLivefyreNetwork = (opts.network === 'livefyre.com');
        var host = this._serviceName + '.' + (isLivefyreNetwork ? opts.environment : opts.network);
        var hostParts;
        if ( ! isLivefyreNetwork && this._protocol=='https') {
            hostParts = opts.network.split('.');
            // Make like 'customer.bootstrap.fyre.co'
            hostParts.splice(1, 0, this._serviceName);
            host = hostParts.join('.');
        }
        return host;
    };

    // Keep track of whether the page is unloading, so we don't throw exceptions
    // if the XHR fails just because of that.
    var windowIsUnloading = false;
    $(window).on('beforeunload', function () {
        windowIsUnloading = true;
    });

    return LivefyreHttpClient;

});