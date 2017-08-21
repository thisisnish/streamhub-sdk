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

/** @override */
QueryBootstrapClient.prototype._getHost = function (opts) {
    var env = opts.environment;
    if (env === 'fyre' || env === 'fy.re') {
        return 'bsconsumer.fyre';
    }
    return 'data.' + (env || 'livefyre.com');
};

/** @override */
QueryBootstrapClient.prototype._getPath = function (opts) {
    return [this._getUrlBase(opts), '/livefyre.com/query/', opts.queryId, '/'].join('');
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
