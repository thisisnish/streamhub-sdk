var ContentHeaderViewFactory = require('streamhub-sdk/content/content-header-view-factory');
var deepClone = require('mout/lang/deepClone');

var content = {
    author: {displayName: 'abc'},
    typeUrn: 'urn:livefyre:js:streamhub-sdk:content:types:livefyre'
};

describe('ContentHeaderViewFactory', function () {
    var contentHeaderViewFactory;

    beforeEach(function () {
        contentHeaderViewFactory = new ContentHeaderViewFactory();
    });

    describe('when constructed', function () {
        it('takes no arguments', function () {
            expect(contentHeaderViewFactory).toBeDefined();
        });

        it('is instance of ContentHeaderViewFactory', function () {
            expect(contentHeaderViewFactory instanceof ContentHeaderViewFactory).toBe(true);
        });
    });

    describe('_getContentPermalink', function () {
        it('returns permalink for twitter', function () {
            expect(contentHeaderViewFactory._getContentPermalink('twitter', {
                tweetId: '123'
            }))
            .toBe('https://twitter.com/statuses/123');
        });

        it('returns permalink for instagram', function () {
            expect(contentHeaderViewFactory._getContentPermalink('instagram', {
                attachments: [{
                    link: 'https://instagram.com/media.png',
                    provider_name: 'instagram'
                }]
            }))
            .toBe('https://instagram.com/media.png');
        });

        it('return permalink for facebook', function () {
            expect(contentHeaderViewFactory._getContentPermalink('facebook', {
                attachments: [{
                    link: 'https://facebook.com/media.png',
                    provider_name: 'facebook'
                }]
            }))
            .toBe('https://facebook.com/media.png');
        });

        it('returns undefined if no attachments', function () {
            expect(contentHeaderViewFactory._getContentPermalink('facebook', {}))
            .toBe(undefined);

            expect(contentHeaderViewFactory._getContentPermalink('facebook', {
                attachments: []
            }))
            .toBe(undefined);
        });

        it('returns undefined if unsupported media provider', function () {
            expect(contentHeaderViewFactory._getContentPermalink('facebook', {
                attachments: [{
                    link: 'https://facebook.com/media.png',
                    provider_name: 'youtube'
                }]
            }))
            .toBe(undefined);
        });

        it('returns undefined if invalid url', function () {
            expect(contentHeaderViewFactory._getContentPermalink('facebook', {
                attachments: [{
                    link: 'https://xyz.facebook.com/media.png',
                    provider_name: 'facebook'
                }]
            }))
            .toBe(undefined);
        });
    });

    describe('getHeaderViewOptsForContent', function () {
        var opts;

        beforeEach(function () {
            opts = deepClone(content);
            opts.author.displayName = null;
        });

        it('uses displayName if there', function () {
            opts.author.displayName = 'bob dole';
            var result = contentHeaderViewFactory.getHeaderViewOptsForContent(opts);
            expect(result).toEqual({
                author: {displayName: 'bob dole'},
                contentSourceName: 'livefyre'
            });
        });

        it('uses handle if no displayName', function () {
            opts.author.handle = 'bobdole';
            var result = contentHeaderViewFactory.getHeaderViewOptsForContent(opts);
            expect(result).toEqual({
                author: {
                    displayName: 'bobdole',
                    handle: 'bobdole'
                },
                contentSourceName: 'livefyre'
            });
        });

        it('uses profileUrl if no displayName and no handle', function () {
            opts.author.profileUrl = 'http://test.com/profile/bobdole';
            var result = contentHeaderViewFactory.getHeaderViewOptsForContent(opts);
            expect(result).toEqual({
                author: {
                    displayName: 'bobdole',
                    profileUrl: 'http://test.com/profile/bobdole'
                },
                contentSourceName: 'livefyre'
            });
        });

        it('leaves the displayName empty if there is no handle or profileUrl', function () {
            var result = contentHeaderViewFactory.getHeaderViewOptsForContent(opts);
            expect(result).toEqual({
                author: {displayName: null},
                contentSourceName: 'livefyre'
            });
        });

        it('creates a content header', function () {
            var header = contentHeaderViewFactory.createHeaderView(content);
            expect(header.elClass).toEqual('content-header');
        });
    });
});
