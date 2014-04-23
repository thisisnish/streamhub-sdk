Livefyre.require(['streamhub-sdk/collection', 'streamhub-sdk/content/views/content-list-view', 'auth'],
function (Collection, ListView, auth) {
    auth.delegate({
        login: function (done) {
            var lftoken = prompt('lftoken?');
            done(null, {
                livefyre: lftoken
            });
        }
    });
    var opts = {
        "network": "livefyre.com",
        "siteId": "313878",
        "articleId": "1",
        "environment": "livefyre.com"
    };

    var view = window.view = new ListView({
        el: document.getElementById('view'),
        sharer: function () {
            console.log('share', arguments);
        }
    });
    var collection = window.collection = new Collection(opts);
    collection.pipe(view);
});
