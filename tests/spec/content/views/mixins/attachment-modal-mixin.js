var $ = require('streamhub-sdk/jquery');
var ListView = require('streamhub-sdk/views/list-view');
var Content = require('streamhub-sdk/content');
var ContentView = require('streamhub-sdk/content/views/content-view');
var hasAttachmentModal = require('streamhub-sdk/content/views/mixins/attachment-modal-mixin');

'use strict';

describe('hasAttachmentModal mixin', function () {

    var content,
        contentView,
        contentListView;

    beforeEach(function () {
        content = new Content({ body: 'hi' });
        listView = new ListView();
        hasAttachmentModal(listView);
        listView.add(new ContentView({ content: content }));
    });

    it('adds a handler for focusContent.hub event', function () {
        expect(listView.events['focusContent.hub']).not.toBe(undefined);
    });
});
