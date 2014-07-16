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

    it('adds the focusContent.hub handler for a ListView', function () {
        content = new Content({ body: 'hi' });
        listView = new ListView();
        hasAttachmentModal(listView);
        listView.add(new ContentView({ content: content }));

        expect(listView.events['focusContent.hub']).not.toBe(undefined);
    });

    it('can be mixed into a ContentView and handles focusContent.hub event', function () {
        contentView = new ContentView({ content: content });
        hasAttachmentModal(contentView);

        expect(contentView.events['focusContent.hub']).not.toBe(undefined);
    });
});
