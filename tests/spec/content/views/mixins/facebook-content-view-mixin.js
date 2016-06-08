var deepClone = require('mout/lang/deepClone');
var FacebookContentView = require('streamhub-sdk/content/views/facebook-content-view');
var facebookFixture = require('json!streamhub-sdk-tests/fixtures/facebook-state.json');
var LivefyreFacebookContent = require('streamhub-sdk/content/types/livefyre-facebook-content');

'use strict';

describe('asFacebookContentView mixin', function () {
    var fixture;

    beforeEach(function () {
        fixture = deepClone(facebookFixture);
    });

    it('adds a link to the created at date if there is an facebook attachment and link is valid', function () {
        fixture.content.attachments[0].link = 'https://facebook.com/p/something';
        var content = new LivefyreFacebookContent(fixture);
        var contentView = new FacebookContentView({ content: content });
        contentView.render();

        var anchor = contentView.$el.find('.content-created-at').children()[0];
        expect(anchor.nodeName).toBe('A');
        expect(anchor.href).toBe('https://facebook.com/p/something');
    });

    it('does not add a link if no facebook attachment', function () {
        fixture.content.attachments = [];
        var content = new LivefyreFacebookContent(fixture);
        var contentView = new FacebookContentView({ content: content });
        contentView.render();
        expect(contentView.$el.find('.content-created-at').children().length).toBe(0);
    });

    it('does not add a link if facebook attachment and no link', function () {
        delete fixture.content.attachments[0].link;
        var content = new LivefyreFacebookContent(fixture);
        var contentView = new FacebookContentView({ content: content });
        contentView.render();
        expect(contentView.$el.find('.content-created-at').children().length).toBe(0);
    });

    it('does not add a link if facebook attachment and link is not valid', function () {
        fixture.content.attachments[0].link = 'https://abc.com/p/something';
        var content = new LivefyreFacebookContent(fixture);
        var contentView = new FacebookContentView({ content: content });
        contentView.render();
        expect(contentView.$el.find('.content-created-at').children().length).toBe(0);
    });
});
