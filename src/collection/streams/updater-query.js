var CollectionUpdater = require('streamhub-sdk/collection/streams/updater');
var inherits = require('inherits');
var QueryStreamClient = require('streamhub-sdk/collection/clients/query-bootstrap-client');

/**
 * A Readable Stream to access streaming updates using filter query ids to
 * receive filtered results.
 * @param {Object} opts Configuration options.
 * @extends {CollectionUpdater}
 */
function QueryCollectionUpdater(opts) {
    // Only allowed to use the QueryStreamClient when using queries.
    opts.streamClient = new QueryStreamClient({queries: opts.queries});
    CollectionUpdater.call(this, opts);
}
inherits(QueryCollectionUpdater, CollectionUpdater);

QueryCollectionUpdater.prototype.pause = function () {};
QueryCollectionUpdater.prototype._read = function () {};
QueryCollectionUpdater.prototype._stream = function () {};

module.exports = QueryCollectionUpdater;
