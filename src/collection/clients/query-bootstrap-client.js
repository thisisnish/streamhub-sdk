var BootstrapClient = require('streamhub-sdk/collection/clients/bootstrap-client');
var inherits = require('inherits');

/**
 * A Client for requesting Livefyre's Bootstrap Service with filter query ids.
 * @param {Object} opts Configuration object.
 * @extends {BootstrapClient}
 * @exports {streamhub-sdk/collection/clients/query-bootstrap-client}
 */
function QueryBootstrapClient(opts) {
    opts = opts || {};
    BootstrapClient.call(this, opts);
}
inherits(QueryBootstrapClient, BootstrapClient);

QueryBootstrapClient.prototype._serviceName = 'bsconsumer';

/** @override */
QueryBootstrapClient.prototype._getPath = function (opts) {
    return [
        this._getUrlBase(opts),
        '/bs4/',
        opts.network,
        '/query/',
        opts.queryId,
        '/'
    ].join('');
};

/**
 * Get the query param object for the bootstrap request.
 * @param {Object} opts Object containing properties related to the request.
 * @return {Object} Object containing query params.
 * @private
 */
QueryBootstrapClient.prototype._getQueryObject = function (opts) {
    var query = {};
    ['max', 'min'].forEach(function (prop) {
        if (opts[prop]) {
            query[prop] = opts[prop];
        }
    });
    return query;
};

/** @override */
QueryBootstrapClient.prototype.getContent = function(opts, callback) {
    this._request({
        data: this._getQueryObject(opts),
        url: this._getPath(opts)
    }, callback || function() {});
};

module.exports = QueryBootstrapClient;
