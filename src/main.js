define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/debug',
    'event-emitter',
    'streamhub-sdk/storage',
    'streamhub-sdk/util',
    'streamhub-sdk/view',
    'streamhub-sdk/clients/livefyre-stream-client',
    'streamhub-sdk/clients/livefyre-bootstrap-client',
    'streamhub-sdk/clients/livefyre-write-client',
    'streamhub-sdk/content/content',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-facebook-content',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/types/oembed',
    'streamhub-sdk/content/types/twitter-content',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/content/views/facebook-content-view',
    'streamhub-sdk/content/views/twitter-content-view',
    'streamhub-sdk/views/list-view',
    'text!streamhub-sdk/version.txt'
], function(
    $,
    debug,
    EventEmitter,
    Storage,
    Util,
    View,
    LivefyreStreamClient,
    LivefyreBootstrapClient,
    LivefyreWriteClient,
    Content,
    LivefyreContent,
    LivefyreFacebookContent,
    LivefyreTwitterContent,
    Oembed,
    TwitterContent,
    ContentView,
    FacebookContentView,
    TwitterContentView,
    ListView,
    VersionInfo
) {
    var exports = {};
    exports.version = $.trim(VersionInfo);
    return exports;
});
