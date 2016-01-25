define([
    'streamhub-sdk/content/util'],
function (util) {
    'use strict';

    describe('streamhub-sdk/content/util', function () {
        describe('inAnchor', function () {
            it('returns false if not within an anchor', function () {
                var str = '<p>abc <a href="http://www.blah.com">http://www.blah.com</a> def</p>';
                expect(util.inAnchor(str, 5)).toBe(null);
            });

            it('returns true if within an anchor', function () {
                var str = '<p>abc <a href="http://www.blah.com">http://www.blah.com</a> def</p>';
                expect(util.inAnchor(str, 15)).toEqual({
                    startIndex: 7,
                    endIndex: 60
                });
            });
        });

        describe('linkify', function () {
            it('does nothing if there are no urls', function () {
                expect(util.linkify('abc def')).toEqual('abc def');
                expect(util.linkify('<p>abc def</p>')).toEqual('<p>abc def</p>');
            });

            it('does not linkify urls within anchors', function () {
                var str = '<p>abc <a href="http://www.blah.com">http://www.blah.com</a> def</p>';
                expect(util.linkify(str)).toEqual(str);

                str = '<p>Watch as I put together an amazing Star Wars Themed Gift thanks to Hallmark! (ad): <a href="https://ooh.li/913875d" target="_blank" rel="nofollow">https://ooh.li/913875d</a> Full tutorial: <a href="http://raisingwhasians.com/2015/11/star-wars-hot-cocoa-holiday-gift-idea-c-3po-marshmallows.html" target="_blank" rel="nofollow">http://raisingwhasians.com/2015/11/star-wars-hot-cocoa-holiday-gift-idea-c-3po-marshmallows.html</a></p>';
                expect(util.linkify(str)).toEqual(str);
            });

            it('linkifies a single url', function () {
                var expected = '<p>abc <a href="http://www.blah.com" target="_blank" rel="nofollow">http://www.blah.com</a> def';
                expect(util.linkify('<p>abc http://www.blah.com def')).toEqual(expected);
            });

            it('linkifies multiple urls', function () {
                var expected = '<p>abc <a href="http://www.blah.com" target="_blank" rel="nofollow">http://www.blah.com</a> <a href="http://google.com" target="_blank" rel="nofollow">http://google.com</a> def';
                expect(util.linkify('<p>abc http://www.blah.com http://google.com def')).toEqual(expected);
            });

            it('works in various conditions', function () {
                var str = '<p>http://google.com</p>';
                expect(util.linkify(str)).toEqual('<p><a href="http://google.com" target="_blank" rel="nofollow">http://google.com</a></p>');

                str = '<p>abc:http://google.com</p>';
                expect(util.linkify(str)).toEqual('<p>abc:<a href="http://google.com" target="_blank" rel="nofollow">http://google.com</a></p>');

                str = '<p>"abc"http://google.com</p>';
                expect(util.linkify(str)).toEqual('<p>"abc"<a href="http://google.com" target="_blank" rel="nofollow">http://google.com</a></p>');

                str = '<p><a href="http://google.com" target="_blank" rel="nofollow">http://google.com</a> http://google.com</p>';
                expect(util.linkify(str)).toEqual('<p><a href="http://google.com" target="_blank" rel="nofollow">http://google.com</a> <a href="http://google.com" target="_blank" rel="nofollow">http://google.com</a></p>');
            });
        });
    });
});
