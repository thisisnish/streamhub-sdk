define([
    'jquery',
    'jasmine-jquery',
    'streamhub-sdk/content/views/oembed-view',
    'hgn!streamhub-sdk/content/templates/oembed-photo',
    'hgn!streamhub-sdk/content/templates/oembed-video',
    'hgn!streamhub-sdk/content/templates/oembed-video-promise',
    'hgn!streamhub-sdk/content/templates/oembed-link',
    'hgn!streamhub-sdk/content/templates/oembed-rich'],
function($, jasmineJquery, OembedView, OembedPhotoTemplate, OembedVideoTemplate, OembedVideoPromiseTemplate, OembedLinkTemplate, OembedRichTemplate) {
    'use strict';

    describe('OembedView', function () {
        var oembedAttachment = {
            provider_name: "Twimg",
            provider_url: "http://pbs.twimg.com",
            type: "photo",
            url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg"
        };

        describe('when constructed', function() {

            describe('with options.oembed', function() {
                var oembedView = new OembedView({ oembed: oembedAttachment });

                it('is instance of OembedView', function() {
                    expect(oembedView).toBeDefined();
                    expect(oembedView instanceof OembedView).toBe(true);
                });
            });
        });

        describe('when rendering', function() {

            it('modifies YouTube thumbnail url', function() {
                oembedAttachment.provider_name = 'YouTube';
                oembedAttachment.thumbnail_url = 'http://i.ytimg.com/vi/OOE9l23P7jg/hqdefault.jpg';
                oembedAttachment.type = 'video';
                var oembedView = new OembedView({ oembed: oembedAttachment });
                oembedView.render();

                expect(oembedView.oembed.thumbnail_url).toBe('http://i.ytimg.com/vi/OOE9l23P7jg/mqdefault.jpg');
            });

            it('emits "imageLoaded.hub" event when image loads successfuly', function() {
                var oembedView = new OembedView({ oembed: oembedAttachment });
                var imageLoadedSpy = spyOnEvent(oembedView.$el, 'imageLoaded.hub');
                oembedView.render();
                oembedView.$el.find('img').trigger('load');

                expect(imageLoadedSpy).toHaveBeenTriggered();
            });

            it('emits "imageLoaded.error" event when image does not load', function() {
                var oembedView = new OembedView({ oembed: oembedAttachment });
                var imageErrorSpy = spyOnEvent(oembedView.$el, 'imageError.hub');
                oembedView.render();
                oembedView.$el.find('img').trigger('error');

                expect(imageErrorSpy).toHaveBeenTriggered();
            });

            describe('a oembed photo', function() {
                oembedAttachment.type = 'photo';
                var oembedView = new OembedView({ oembed: oembedAttachment });
                oembedView.render();

                it('uses OembedPhotoTemplate', function() {
                    expect(oembedView.template).toBe(OembedPhotoTemplate);
                });
            });

            describe('a oembed video', function() {
                oembedAttachment.type = 'video';
                var oembedView = new OembedView({ oembed: oembedAttachment });
                oembedView.render();

                it('uses OembedVideoTemplate', function() {
                    expect(oembedView.template).toBe(OembedVideoTemplate);
                });
            });

            describe('a oembed link', function() {
                oembedAttachment.type = 'link';
                var oembedView = new OembedView({ oembed: oembedAttachment });
                oembedView.render();

                it('uses OembedLinkTemplate', function() {
                    expect(oembedView.template).toBe(OembedLinkTemplate);
                });
            });

            describe('a oembed rich', function() {
                oembedAttachment.type = 'rich';
                var oembedView = new OembedView({ oembed: oembedAttachment });
                oembedView.render();

                it('uses OembedRichTemplate', function() {
                    expect(oembedView.template).toBe(OembedRichTemplate);
                });
            });

            describe('a oembed video promise', function() {
                oembedAttachment.type = 'video_promise';
                var oembedView = new OembedView({ oembed: oembedAttachment });
                oembedView.render();

                it('uses OembedVideoPromiseTemplate', function() {
                    expect(oembedView.template).toBe(OembedVideoPromiseTemplate);
                });
            });
        });

        describe('#getAspectRatio', function () {
            var oembed;
            var aspectRatio;
            var complete = false;
            var assertAspectRatio = function (oembed, expectedRatio, isMobile) {
                var ov = new OembedView({oembed: oembed});
                ov._isMobile = !!isMobile;

                runs(function () {
                    ov.getAspectRatio(function (ar) {
                        complete = true;
                        aspectRatio = ar;
                    });
                });

                waitsFor(function () {
                    return complete;
                });

                runs(function () {
                    expect(aspectRatio).toEqual(expectedRatio);
                });
            };

            beforeEach(function () {
                oembed = $.merge({}, oembedAttachment);
                complete = false;
            });

            it('returns a ratio of width over height', function () {
                oembed.width = 640;
                oembed.height = 360;
                assertAspectRatio(oembed, 16/9);
            });

            it('falls back to thumbnail dimensions if width and height are not provided', function () {
                oembed.thumbnail_width = 100;
                oembed.thumbnail_height = 120;
                assertAspectRatio(oembed, 5/6);
            });

            it('calculates image dimensions if width/height and thumbnail width/height are missing, and is a photo', function () {
                oembed.type = 'photo';
                oembed.url = 'http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg';
                assertAspectRatio(oembed, 2);
            });

            it('calculates image dimensions if width/height and thumbnail width/height are missing, and has a thumbnail', function () {
                oembed.type = 'video';
                oembed.url = 'https://www.google.com';
                oembed.thumbnail_url = 'http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg';
                assertAspectRatio(oembed, 2);
            });

            it('default 1 for no width / height', function () {
                oembed.type = 'video';
                assertAspectRatio(oembed, 1);
            });

            it('returns a 16/9 aspect ratio for youtube as an override', function () {
                oembed.provider_name = 'youtube';
                oembed.width = 100;
                oembed.height = 100;
                assertAspectRatio(oembed, 16/9);
            });

            it('returns a 16/9 aspect ratio for facebook on mobile as an override', function () {
                oembed.provider_name = 'facebook';
                oembed.width = 100;
                oembed.height = 100;
                assertAspectRatio(oembed, 16/9, true);
            });
        });
    });
});
