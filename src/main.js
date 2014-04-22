define([
    'streamhub-sdk/jquery',
    'text!streamhub-sdk/version.txt',
    'streamhub-sdk/collection',
    'streamhub-sdk/content'],
function($, version, Collection, Content) {
    'use strict';

    return {
        version: $.trim(version),
        Collection: Collection,
        Content: Content
    };
});
