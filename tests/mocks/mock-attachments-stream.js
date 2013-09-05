define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/stream',
    'streamhub-sdk/content/content',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/streams/livefyre-reverse-stream',
    'json!tests/mocks/bootstrap-data.json'
], function ($, Stream, Content, LivefyreContent, LivefyreReverseStream, fixture) {

    /**
     * A MockAttachmentsStream of Content
     */
    var MockAttachmentsStream = function MockAttachmentsStream (opts) {
        opts = opts || {};
        opts.network = 'blah';
        opts.collectionId = 'blah';
        opts.commentId = 'blah';
        opts.environment = 'blah';
        LivefyreReverseStream.call(this, opts);
        this.interval = opts.interval || 1000;
        this.timeout = null;
        this.writeLatency = opts.writeLatency || 0;
    };
    $.extend(MockAttachmentsStream.prototype, LivefyreReverseStream.prototype);

    MockAttachmentsStream.prototype._getFixture = function () {
        for (var provider in fixture['content']) {
            var state = fixture['content'][provider];
            if (!Object.keys(state).length) {
                delete fixture['content'][provider];
            }
        }
        return fixture;
    };

    MockAttachmentsStream.prototype._read = function() {
        this._handleBootstrapDocument(this._getFixture());
    };
                                                         
    MockAttachmentsStream.prototype._write = function (content, onWritten) {
        var self = this;                                 
        function write () {                              
            content.set({
                id: Math.floor(999999999 * Math.random())
            });
            self._push(content);
            onWritten && onWritten.call(self, null, content);
        }
        if (this.writeLatency) {
            setTimeout(write, this.writeLatency);
        } else {
            write();
        }
    };

    return MockAttachmentsStream;
});
