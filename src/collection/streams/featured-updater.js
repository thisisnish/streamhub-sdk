var inherits = require('inherits');
var Readable = require('stream/readable');
var PassThrough = require('stream/passthrough');
var util = require('stream/util');
var StateToContent = require('streamhub-sdk/content/state-to-content');
var FeaturedFilter = require('streamhub-sdk/collection/streams/featured-filter');
var Storage = require('streamhub-sdk/storage');
var fetchContent = require('streamhub-sdk/content/fetch-content');
var debug = require('streamhub-sdk/debug');

'use strict';

var FeaturedUpdater = function (opts) {
    opts = opts || {};

    PassThrough.apply(this, arguments);

    this._collection = opts.collection;
    this._updater = this._collection._updater;
    if (! this._updater) {
        this._updater = this._collection.createUpdater();
    }
    this._annotator = this._updater._createAnnotator();

    this._updater.on('annotation.add', function (contentId, addAnnotations) {
        var featuredMessage = addAnnotations.featuredmessage;
        if (! featuredMessage) {
            return;
        }

        var content = Storage.get(contentId);
        if (! content) {
            this._collection.fetchContent(contentId, function (err, content) {
                if (! content) {
                    return;
                }
                this._annotator.annotate(content, { added: addAnnotations });
                this.write(content);
            }.bind(this));
        }
    }.bind(this));

    this._updater
        .pipe(new FeaturedFilter())
        .pipe(this);

};
inherits(FeaturedUpdater, PassThrough);

module.exports = FeaturedUpdater;
