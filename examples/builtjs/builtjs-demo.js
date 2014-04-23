debugger;
// if (typeof Livefyre === 'object' && typeof Livefyre.require === 'function' && Livefyre.require.amd) {
//     return Livefyre.require;
// }
// if (typeof require === 'function' && require.amd) {
//     return require;
// }

Livefyre.require(['streamhub-sdk/collection', 'streamhub-sdk/content/views/content-list-view'],
function (Collection, ListView) {
    debugger;
    var opts = {
        "network": "labs-t402.fyre.co",
        "siteId": "303827",
        "articleId": "xbox-0",
        "environment": "t402.livefyre.com"
    };

    var view = window.view = new ListView({ el: document.getElementById('view') });
    var collection = window.collection = new Collection(opts);

    collection.pipe(view);
});
