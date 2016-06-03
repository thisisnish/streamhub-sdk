define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/types/livefyre-content',
    'json!streamhub-sdk-tests/fixtures/verified-tweet-state.json',
    'json!streamhub-sdk-tests/fixtures/unverified-tweet-state.json',
    'mout/lang/deepClone'],
function ($, LivefyreTwitterContent, LivefyreContent, verifiedTweetState, unverifiedTweetState, deepClone) {
    'use strict';

    describe('A LivefyreTwitterContent object', function () {
        it('has .twitterVerified if the content author is a verified twitter user', function () {
            var content = new LivefyreTwitterContent(verifiedTweetState);
            expect(content.twitterVerified).toBe(true);
        });

        it('is not .twitterVierifed if the content author is not a verified twitter user', function () {
            var content = new LivefyreTwitterContent(unverifiedTweetState);
            expect(content.twitterVerified).toBe(false);
        });

        describe('handles link attachments', function () {
            var tweet = deepClone(unverifiedTweetState);
            tweet.content.attachments = [{
                provider_url: "http://www.billboard.com",
                title: "Twitter Video",
                url: "http://www.billboard.com/articles/news/dance/7385875/alyx-ander-delerium-remix-silence-sarah-mclachlan-premiere",
                type: "link",
                thumbnail_width: 1548,
                version: "1.0",
                link: "http://twitter.com/intel/status/729898038332821504/video/1",
                provider_name: "Billboard",
                thumbnail_url: "http://www.billboard.com/files/media/Alyx-Ander-press-bw-2016-billboard-1548.jpg",
                thumbnail_height: 1024
            }];

            describe('does not add an attachment when:', function () {
                it('the provider is twitter and link has /video/ in it', function () {
                    tweet.content.attachments[0].link = 'http://twitter.com/intel/status/729898038332821504/video/1';
                    tweet.content.attachments[0].provider_name = 'twitter';
                    tweet.content.attachments[0].title = 'something';

                    spyOn(LivefyreContent.prototype, 'addAttachment');
                    spyOn(LivefyreTwitterContent.prototype, 'addAttachment');
                    new LivefyreTwitterContent(tweet);
                    expect(LivefyreTwitterContent.prototype.addAttachment).toHaveBeenCalled();
                    expect(LivefyreContent.prototype.addAttachment).not.toHaveBeenCalled();
                });

                it('the provider is twitter and title says "twitter video"', function () {
                    tweet.content.attachments[0].link = 'http://twitter.com/intel/status/729898038332821504/photo/1';
                    tweet.content.attachments[0].provider_name = 'twitter';
                    tweet.content.attachments[0].title = 'Twitter Video';

                    spyOn(LivefyreContent.prototype, 'addAttachment');
                    spyOn(LivefyreTwitterContent.prototype, 'addAttachment');
                    new LivefyreTwitterContent(tweet);
                    expect(LivefyreTwitterContent.prototype.addAttachment).toHaveBeenCalled();
                    expect(LivefyreContent.prototype.addAttachment).not.toHaveBeenCalled();
                });

                it('the provider is twimg and link has /video/ in it', function () {
                    tweet.content.attachments[0].link = 'http://twitter.com/intel/status/729898038332821504/video/1';
                    tweet.content.attachments[0].provider_name = 'twimg';
                    tweet.content.attachments[0].title = 'something';

                    spyOn(LivefyreContent.prototype, 'addAttachment');
                    spyOn(LivefyreTwitterContent.prototype, 'addAttachment');
                    new LivefyreTwitterContent(tweet);
                    expect(LivefyreTwitterContent.prototype.addAttachment).toHaveBeenCalled();
                    expect(LivefyreContent.prototype.addAttachment).not.toHaveBeenCalled();
                });

                it('the provider is twimg and title says "twitter video"', function () {
                    tweet.content.attachments[0].link = 'http://twitter.com/intel/status/729898038332821504/photo/1';
                    tweet.content.attachments[0].provider_name = 'twimg';
                    tweet.content.attachments[0].title = 'Twitter Video';

                    spyOn(LivefyreContent.prototype, 'addAttachment');
                    spyOn(LivefyreTwitterContent.prototype, 'addAttachment');
                    new LivefyreTwitterContent(tweet);
                    expect(LivefyreTwitterContent.prototype.addAttachment).toHaveBeenCalled();
                    expect(LivefyreContent.prototype.addAttachment).not.toHaveBeenCalled();
                });
            });

            describe('does add an attachment when:', function () {
                it('the provider is not twitter or twimg', function () {
                    tweet.content.attachments[0].link = 'http://twitter.com/intel/status/729898038332821504/video/1';
                    tweet.content.attachments[0].provider_name = 'Billboard';
                    tweet.content.attachments[0].title = 'Twitter Video';

                    spyOn(LivefyreContent.prototype, 'addAttachment');
                    spyOn(LivefyreTwitterContent.prototype, 'addAttachment');
                    new LivefyreTwitterContent(tweet);
                    expect(LivefyreTwitterContent.prototype.addAttachment).toHaveBeenCalled();
                    expect(LivefyreContent.prototype.addAttachment).not.toHaveBeenCalled();
                });

                it('this provider is twitter and the title and link are ok', function () {
                    tweet.content.attachments[0].link = 'http://twitter.com/intel/status/729898038332821504/photo/1';
                    tweet.content.attachments[0].provider_name = 'twitter';
                    tweet.content.attachments[0].title = 'something';

                    spyOn(LivefyreContent.prototype, 'addAttachment');
                    spyOn(LivefyreTwitterContent.prototype, 'addAttachment');
                    new LivefyreTwitterContent(tweet);
                    expect(LivefyreTwitterContent.prototype.addAttachment).toHaveBeenCalled();
                    expect(LivefyreContent.prototype.addAttachment).not.toHaveBeenCalled();
                });

                it('this provider is twimg and the title and link are ok', function () {
                    tweet.content.attachments[0].link = 'http://twitter.com/intel/status/729898038332821504/photo/1';
                    tweet.content.attachments[0].provider_name = 'twimg';
                    tweet.content.attachments[0].title = 'something';

                    spyOn(LivefyreContent.prototype, 'addAttachment');
                    spyOn(LivefyreTwitterContent.prototype, 'addAttachment');
                    new LivefyreTwitterContent(tweet);
                    expect(LivefyreTwitterContent.prototype.addAttachment).toHaveBeenCalled();
                    expect(LivefyreContent.prototype.addAttachment).not.toHaveBeenCalled();
                });
            });
        });
    });
});
