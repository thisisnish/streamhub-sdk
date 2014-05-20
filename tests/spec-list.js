define(function () {
    var specs = [
        'tests/spec/main',
        'tests/spec/debug',
        'tests/spec/storage',
        'tests/spec/util',
        'tests/spec/view',
        'tests/spec/views/list-view',
        'tests/spec/views/show-more-button',
        'tests/spec/views/streams/more',
        'tests/spec/views/streams/injector',
        'tests/spec/collection/main',
        'tests/spec/collection/liker',
        'tests/spec/collection/clients/stream-client',
        'tests/spec/collection/clients/bootstrap-client',
        'tests/spec/collection/clients/create-client',
        'tests/spec/collection/clients/write-client',
        'tests/spec/collection/streams/archive',
        'tests/spec/collection/streams/updater',
        'tests/spec/collection/streams/writer',
        'tests/spec/collection/featured-contents',
        'tests/spec/collection/streams/featured-archive',
        'tests/spec/auth/main',
        'tests/spec/content/state-to-content',
        'tests/spec/content/annotator',
        'tests/spec/content/main',
        'tests/spec/content/types/livefyre-content',
        'tests/spec/content/types/livefyre-facebook-content',
        'tests/spec/content/types/livefyre-twitter-content',
        'tests/spec/content/types/oembed',
        'tests/spec/content/types/livefyre-oembed',
        'tests/spec/content/content-view-factory',
        'tests/spec/content/views/content-view',
        'tests/spec/content/views/livefyre-content-view',
        'tests/spec/content/views/twitter-content-view',
        'tests/spec/content/views/oembed-view',
        'tests/spec/content/views/attachment-list-view',
        'tests/spec/content/views/tiled-attachment-list-view',
        'tests/spec/content/views/block-attachment-list-view',
        'tests/spec/content/views/gallery-attachment-list-view',
        'tests/spec/content/views/content-list-view',
        'tests/spec/modal/main',
        'tests/spec/modal/views/attachment-gallery-modal',
        'tests/spec/ui/button',
        'tests/spec/ui/command',
        'tests/spec/ui/auth-required-command'
    ];
    return specs;
});
