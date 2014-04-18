define([
    'streamhub-sdk/jquery',
    'text!streamhub-sdk/version.txt',
    'streamhub-sdk/collection'],
function($, version, Collection) {
    'use strict';

    return {
        version: $.trim(version),
        Collection: Collection
    };
});
