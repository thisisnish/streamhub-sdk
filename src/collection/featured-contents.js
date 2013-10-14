define([
    'streamhub-sdk/collection/streams/featured-archive',
    'streamhub-sdk/debug'],
function (FeaturedArchive, debug) {
    'use strict';

    var log = debug('streamhub-sdk/collection/featured-contents');

    /**
     * An Object that represents a hosted StreamHub Collection
     */
    var FeaturedContents = function (opts) {
        opts = opts || {};
        this._collection = opts.collection;
    };

    /**
     * Create a readable stream that will read through the Archive of Featured
     * Contents in the Collection.
     * @param opts {object}
     * @returns {streamhub-sdk/collection/streams/featured-archive}
     */
    FeaturedContents.prototype.createArchive = function (opts) {
        opts = opts || {};
        opts.collection = this._collection;
        return new FeaturedArchive(opts);
    };

    return FeaturedContents;
});