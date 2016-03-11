var $ = require('streamhub-sdk/jquery');

module.exports = {
    version: $.trim(require('text!streamhub-sdk/version.txt')),
    Collection: require('streamhub-sdk/collection'),
    Content: require('streamhub-sdk/content'),
    ContentView: require('streamhub-sdk/content/views/content-view'),
    ContentViewFactory: require('streamhub-sdk/content/content-view-factory'),
    ContentListView: require('streamhub-sdk/content/views/content-list-view'),
    Followers: require('streamhub-sdk/collection/followers'),
    ListView: require('streamhub-sdk/views/list-view'),
    LivefyreHttpClient: require('streamhub-sdk/collection/clients/http-client'),
    StateToContent: require('streamhub-sdk/content/state-to-content')
};
