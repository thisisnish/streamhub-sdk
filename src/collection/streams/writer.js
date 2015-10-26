define([
    'stream/writable',
    'streamhub-sdk/collection/clients/write-client',
    'streamhub-sdk/auth',
    'inherits',
    'streamhub-sdk/debug'],
function (Writable, LivefyreWriteClient, Auth, inherits, debug) {
    'use strict';

    var log = debug('streamhub-sdk/collection/streams/writer');

    /**
     * A Writable Stream that, when written to, writes into a StreamHub
     * Collection
     * @param opts {object} options
     * @param opts.collection {streamhub-sdk/collection} Collection to write
     *   into
     */
    var CollectionWriter = function (opts) {
        this._collection = opts.collection;
        this._writeClient = opts.writeClient || new LivefyreWriteClient();
        Writable.call(this, opts);

        this.on('error', function (err) {
            log(err);
        });
    };

    inherits(CollectionWriter, Writable);


    CollectionWriter.prototype._write = function _write(content, done) {
        var self = this,
            collection = this._collection,
            token = Auth.getToken(),
            post = this._writeClient.postContent,
            numAttachments = content.attachments && content.attachments.length;

        if ( ! token) {
            throw new Auth.UnauthorizedError("Collection cannot write until streamhub-sdk/auth.setToken has been called");
        }

        if ( ! collection.id) {
            return collection.initFromBootstrap(function () {
                _write.call(self, content, done);
            });
        }

        var postParams = {
            body: content.body,
            collectionId: collection.id,
            environment: collection.environment,
            lftoken: Auth.getToken(),
            network: collection.network
        };

        if (numAttachments) {
            var attachment;
            postParams.media = [];
            for (var i=0; i < numAttachments; i++) {
                attachment = content.attachments[i];
                if (typeof attachment.toJSON === 'function') {
                    attachment = attachment.toJSON();
                }
                postParams.media.push(attachment);
            }
        }

        if (content.title) {
            postParams.title = content.title;
        }

        if (content.parentId) {
            postParams.parent_id = content.parentId;
        }

        // Tweets can be posted by ID via _writeClient.postTweet
        if (content.tweetId) {
            post = this._writeClient.postTweet;
            postParams.tweetId = content.tweetId;
        }

        post.call(this._writeClient, postParams, function (err, response) {
            if (err) {
                return done(err.body);
            }
            if (response.status === 'error') {
                return done(response);
            }
            content.set({
                collection: this._collection,
                id: response.data.messages[0].content.id
            });
            done();
        }.bind(this));
    };


    return CollectionWriter;
});
