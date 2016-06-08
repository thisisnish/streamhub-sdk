var deepClone = require('mout/lang/deepClone');
var InstagramContentView = require('streamhub-sdk/content/views/instagram-content-view');
var instagramFixture = require('json!streamhub-sdk-tests/fixtures/instagram-curate-state.json');
var LivefyreInstagramContent = require('streamhub-sdk/content/types/livefyre-instagram-content');

'use strict';

describe('asInstagramContentView mixin', function () {
    var fixture;

    beforeEach(function () {
        fixture = deepClone(instagramFixture);
    });

    it('adds a link to the created at date if there is an instagram attachment and link is valid', function () {
        fixture.content.attachments[0].link = 'https://instagram.com/p/something';
        var content = new LivefyreInstagramContent(fixture);
        var contentView = new InstagramContentView({ content: content });
        contentView.render();

        var anchor = contentView.$el.find('.content-created-at').children()[0];
        expect(anchor.nodeName).toBe('A');
        expect(anchor.href).toBe('https://instagram.com/p/something');
    });

    it('does not add a link if no instagram attachment', function () {
        fixture.content.attachments = [];
        var content = new LivefyreInstagramContent(fixture);
        var contentView = new InstagramContentView({ content: content });
        contentView.render();
        expect(contentView.$el.find('.content-created-at').children().length).toBe(0);
    });

    it('does not add a link if instagram attachment and no link', function () {
        var content = new LivefyreInstagramContent(fixture);
        var contentView = new InstagramContentView({ content: content });
        contentView.render();
        expect(contentView.$el.find('.content-created-at').children().length).toBe(0);
    });

    it('does not add a link if instagram attachment and link is not valid', function () {
        fixture.content.attachments[0].link = 'https://abc.com/p/something';
        var content = new LivefyreInstagramContent(fixture);
        var contentView = new InstagramContentView({ content: content });
        contentView.render();
        expect(contentView.$el.find('.content-created-at').children().length).toBe(0);
    });
});
