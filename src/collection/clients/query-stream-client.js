var inherits = require('inherits');
var StreamClient = require('streamhub-sdk/collection/clients/stream-client');

/**
 * A Client for requesting Livefyre's Stream Service with filter query ids.
 * @param {Object} opts Configuration object.
 * @extends {StreamClient}
 * @exports {streamhub-sdk/collection/clients/query-stream-client}
 */
function QueryStreamClient(opts) {
    opts = opts || {};
    StreamClient.call(this, opts);
}
inherits(QueryStreamClient, StreamClient);

QueryStreamClient.prototype.getContent = function () {};
QueryStreamClient.prototype._getData = function () {};
QueryStreamClient.prototype._getPath = function () {};

module.exports = QueryStreamClient;
