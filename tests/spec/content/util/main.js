var util = require('streamhub-sdk/content/util/main');

describe('content/util', function () {
    describe('getContentPermalink', function () {
        it('returns permalink for twitter', function () {
            expect(util.getContentPermalink('twitter', {
                tweetId: '123'
            }))
            .toBe('https://twitter.com/statuses/123');
        });

        it('returns permalink for instagram', function () {
            expect(util.getContentPermalink('instagram', {
                attachments: [{
                    link: 'https://instagram.com/media.png',
                    provider_name: 'instagram'
                }]
            }))
            .toBe('https://instagram.com/media.png');
        });

        it('return permalink for facebook', function () {
            expect(util.getContentPermalink('facebook', {
                attachments: [{
                    link: 'https://facebook.com/media.png',
                    provider_name: 'facebook'
                }]
            }))
            .toBe('https://facebook.com/media.png');
        });

        it('returns undefined if no attachments', function () {
            expect(util.getContentPermalink('facebook', {}))
            .toBe(undefined);

            expect(util.getContentPermalink('facebook', {
                attachments: []
            }))
            .toBe(undefined);
        });

        it('returns undefined if unsupported media provider', function () {
            expect(util.getContentPermalink('facebook', {
                attachments: [{
                    link: 'https://facebook.com/media.png',
                    provider_name: 'youtube'
                }]
            }))
            .toBe(undefined);
        });

        it('returns undefined if invalid url', function () {
            expect(util.getContentPermalink('facebook', {
                attachments: [{
                    link: 'https://xyz.facebook.com/media.png',
                    provider_name: 'facebook'
                }]
            }))
            .toBe(undefined);
        });
    });

    describe('truncateHtml', function () {
        it('truncates regular text', function () {
            expect(util.truncateHtml('this is a test', 6)).toEqual('this i…');
        });

        describe('truncates html', function () {
            it('without sub-elements', function () {
                expect(util.truncateHtml('<p>this is a test</p>', 6)).toEqual('<p>this i…</p>');
            });

            it('in the middle of an element', function () {
                expect(util.truncateHtml('<p>this <a href="abc">is a</a> test</p>', 6)).toEqual('<p>this <a href="abc">i…</a></p>');
            });

            it('before an element', function () {
                expect(util.truncateHtml('<p>this <a href="abc">is a</a> test</p>', 3)).toEqual('<p>thi…</p>');
            });

            it('after an element', function () {
                expect(util.truncateHtml('<p>this <a href="abc">is a</a> test</p>', 12)).toEqual('<p>this <a href="abc">is a</a> te…</p>');
            });

            it('deep in nested elements', function () {
                expect(util.truncateHtml('<p>this <span>is a <a href="abc">really</a> long</span> test</p>', 13)).toEqual('<p>this <span>is a <a href="abc">rea…</a></span></p>');
                expect(util.truncateHtml('<p>this <span>is a <a href="abc">really</a> long</span> test</p>', 19)).toEqual('<p>this <span>is a <a href="abc">really</a> lo…</span></p>');
                expect(util.truncateHtml('<p>this <span>is a <a href="abc">really</a> long</span> test</p>', 24)).toEqual('<p>this <span>is a <a href="abc">really</a> long</span> te…</p>');
            });
        });
    });
});
