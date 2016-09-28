define([
    'jquery',
    'jasmine-jquery',
    'streamhub-sdk/content',
    'streamhub-sdk/content/views/gallery-attachment-list-view',
    'streamhub-sdk/content/views/oembed-view'],
function($, jasmineJquery, Content, GalleryAttachmentListView) {
    'use strict';

    describe('GalleryAttachmentListView', function () {
        var oembedAttachment = {
            provider_name: "Twimg",
            provider_url: "http://pbs.twimg.com",
            type: "photo",
            url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg"
        };
        var content = new Content({ body: 'what' });

        describe('when constructed', function() {

            describe('with no arguments or options', function() {
                var galleryAttachmentListView = new GalleryAttachmentListView();
                it('is instance of GalleryAttachmentListView', function() {
                    expect(galleryAttachmentListView).toBeDefined();
                    expect(galleryAttachmentListView instanceof GalleryAttachmentListView).toBe(true);
                });
            });

            describe('with opts.content', function() {
                var galleryAttachmentListView = new GalleryAttachmentListView({ content: content });
                it('is instance of GalleryAttachmentListView', function() {
                    expect(galleryAttachmentListView).toBeDefined();
                    expect(galleryAttachmentListView instanceof GalleryAttachmentListView).toBe(true);
                });
            });

            describe('with opts.pageButtons', function() {
                var galleryAttachmentListView = new GalleryAttachmentListView({ pageButtons: true });
                it('is instance of GalleryAttachmentListView', function() {
                    expect(galleryAttachmentListView).toBeDefined();
                    expect(galleryAttachmentListView instanceof GalleryAttachmentListView).toBe(true);
                });
            });

            describe('with opts.thumbnails', function() {
                var galleryAttachmentListView = new GalleryAttachmentListView({ thumbnails: true });
                it('is instance of GalleryAttachmentListView', function() {
                    expect(galleryAttachmentListView).toBeDefined();
                    expect(galleryAttachmentListView instanceof GalleryAttachmentListView).toBe(true);
                });
            });

            describe('with opts.pageCount', function() {
                var galleryAttachmentListView = new GalleryAttachmentListView({ pageCount: true });
                it('is instance of GalleryAttachmentListView', function() {
                    expect(galleryAttachmentListView).toBeDefined();
                    expect(galleryAttachmentListView instanceof GalleryAttachmentListView).toBe(true);
                });
            });
        });

        describe('when rendering', function() {

            it('focuses the specified attachment', function() {
                var content = new Content();
                var galleryAttachmentListView = new GalleryAttachmentListView({ content: content, attachmentToFocus: oembedAttachment });
                content.addAttachment(oembedAttachment);
                galleryAttachmentListView.render();
                expect(galleryAttachmentListView.$el.find('.content-attachments-gallery-focused')).toBe('div');
            });

            describe('with pageButtons', function() {
                var galleryAttachmentListView = new GalleryAttachmentListView({ pageButtons: true });
                galleryAttachmentListView.render();

                it('has prev and next buttons in the modal', function() {
                    expect(galleryAttachmentListView.$el.find('.content-attachments-gallery-prev')).toBe('div');
                    expect(galleryAttachmentListView.$el.find('.content-attachments-gallery-next')).toBe('div');
                });
            });

            describe('with thumbnails', function() {
                var galleryAttachmentListView = new GalleryAttachmentListView({ thumbnails: true });
                galleryAttachmentListView.render();

                it('has thumbnails for each attachment of the content', function() {
                    expect(galleryAttachmentListView.$el.find('.content-attachments-gallery-thumbnails')).toBe('div');
                });
            });

            describe('with pageCount', function() {
                var galleryAttachmentListView = new GalleryAttachmentListView({ pageCount: true });
                galleryAttachmentListView.render();

                it('has a page count (e.g. "1 of 5")', function() {
                    expect(galleryAttachmentListView.$el.find('.content-attachments-gallery-count')).toBe('div');
                });
            });
        });

        describe('when clicking a thumbnail', function() {
            var galleryAttachmentListView,
                content = new Content(),
                attachmentListViewOpts = { content: content, attachmentToFocus: oembedAttachment};

            it('emits focusContent.hub event', function() {
                galleryAttachmentListView = new GalleryAttachmentListView(attachmentListViewOpts);
                galleryAttachmentListView.setElement($('<div></div>'));
                galleryAttachmentListView.render();
                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    var attachment = $.extend({}, oembedAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
                var thumbnailAttachmentEl = galleryAttachmentListView.$el.find('.content-attachments-gallery-thumbnails .content-attachment:first');

                var spyFocusAttachmentEvent = spyOnEvent(thumbnailAttachmentEl[0], 'focusContent.hub');
                var tileClicked = false;
                galleryAttachmentListView.$el.on('focusContent.hub', function() {
                    tileClicked = true;
                });

                thumbnailAttachmentEl.trigger('click');
                expect(tileClicked).toBe(true);
                expect(spyFocusAttachmentEvent).toHaveBeenTriggered();
            });
        });

        describe('when clicking on the modal', function () {
            var content;
            var evented;
            var galleryAttachmentListView;
            var tiledAttachmentEl;

            beforeEach(function () {
                evented = false;
                content = new Content();
                galleryAttachmentListView = new GalleryAttachmentListView({content: content});
                galleryAttachmentListView.setElement($('<div></div>'));
                galleryAttachmentListView.render();
                galleryAttachmentListView.$el.on('hideModal.hub', function () {
                    evented = true;
                });
                spyOn(galleryAttachmentListView.events, 'click').andCallThrough();
                galleryAttachmentListView.delegateEvents();
            });

            it('emits a hideModal.hub event if not clicking on the attachment', function () {
                var attachment = $.extend({}, oembedAttachment);
                attachment.id = 1;
                content.addAttachment(attachment);
                galleryAttachmentListView.$el.find('.content-attachments-focused').trigger('click');
                expect(galleryAttachmentListView.events.click).toHaveBeenCalled();
                expect(evented).toBe(true);
            });

            describe('does not emit event if clicking on...', function () {
                it('native video attachment', function () {
                    content.addAttachment({
                        id: 1,
                        provider_url: "http://instagram.com/",
                        title: "#cat #animals #cuttiest #cats #mew #mewfamily #santaslittlehelpers #galgo #podenco #greyhound #catsanddogs",
                        url: "https://scontent.cdninstagram.com/t50.2886-16/14132404_324817204526260_1456165414_n.mp4",
                        type: "video",
                        html: '<video width="640" height="360" controls><source src="https://scontent.cdninstagram.com/t50.2886-16/14132404_324817204526260_1456165414_n.mp4" type="video/mp4" /></video>',
                        author_name: "meow__woof__family",
                        height: 360,
                        width: 640,
                        version: "1.0",
                        link: "https://www.instagram.com/p/BJjCxEhDNAw/",
                        thumbnail_width: 320,
                        provider_name: "Instagram",
                        thumbnail_url: "https://scontent.cdninstagram.com/t51.2885-15/s320x320/e15/14134868_1314062681967979_1270452668_n.jpg?ig_cache_key=MTMyNDkxNDg4MzU3Mzg5NTIxNg%3D%3D.2",
                        thumbnail_height: 180,
                        author_url: "http://instagram.com/meow__woof__family"
                    });
                    galleryAttachmentListView.$el.find('.content-attachments-focused video').trigger('click');
                    expect(galleryAttachmentListView.events.click).toHaveBeenCalled();
                    expect(evented).toBe(false);
                });

                it('nested video attachment', function () {
                    content.addAttachment({
                        id: 1,
                        provider_url: "http://instagram.com/",
                        title: "#cat #animals #cuttiest #cats #mew #mewfamily #santaslittlehelpers #galgo #podenco #greyhound #catsanddogs",
                        url: "https://scontent.cdninstagram.com/t50.2886-16/14132404_324817204526260_1456165414_n.mp4",
                        type: "video",
                        html: '<div><h2>something</h2><video width="640" height="360" controls><source src="https://scontent.cdninstagram.com/t50.2886-16/14132404_324817204526260_1456165414_n.mp4" type="video/mp4" /></video></div>',
                        author_name: "meow__woof__family",
                        height: 360,
                        width: 640,
                        version: "1.0",
                        link: "https://www.instagram.com/p/BJjCxEhDNAw/",
                        thumbnail_width: 320,
                        provider_name: "Instagram",
                        thumbnail_url: "https://scontent.cdninstagram.com/t51.2885-15/s320x320/e15/14134868_1314062681967979_1270452668_n.jpg?ig_cache_key=MTMyNDkxNDg4MzU3Mzg5NTIxNg%3D%3D.2",
                        thumbnail_height: 180,
                        author_url: "http://instagram.com/meow__woof__family"
                    });
                    galleryAttachmentListView.$el.find('.content-attachments-focused video').trigger('click');
                    expect(galleryAttachmentListView.events.click).toHaveBeenCalled();
                    expect(evented).toBe(false);
                });
            });
        });

        describe ('when focusing a tiled video attachment', function() {
            var oembedVideoAttachment = {
                provider_name: "YouTube",
                provider_url: "http://youtube.com",
                type: "video",
                thumbnail_url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg",
                html: "<iframe src='http://video.source.html?src=http://youtube.com&anotherParam=1'>here's your video player</iframe>"
            },
            noAutoplayVideoAttachment = {
                provider_name: "Vimeo",
                provider_url: "http://youtube.com",
                type: "video",
                thumbnail_url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg",
                html: "<iframe src='http://video.source.html'>here's your video player</iframe>"
            },
            noRelatedVideoAttachment = {
                provider_name: "Vimeo",
                provider_url: "http://vimeo.com",
                type: "video",
                thumbnail_url: "http://i.vimeocdn.com/video/447095475_1280.jpg",
                html: "<iframe src='http://video.source.html?src=https://player.vimeo.com/video/73096254&anotherParam=1'>here's your video player</iframe>"
            },
            noProviderNameAttachment = {
                type: "video",
                thumbnail_url: "http://i.vimeocdn.com/video/447095475_1280.jpg",
                html: "<iframe src='http://video.source.html?src=https://player.vimeo.com/video/73096254&anotherParam=1'>here's your video player</iframe>"
            },
            rawVideoAttachment = {
                type: "video",
                thumbnail_url: "https://pbs.twimg.com/ext_tw_video_thumb/776222315440959488/pu/img/HD8gLsr6YCDHyilI.jpg:small",
                html: "<video controls><source src='https://video.twimg.com/ext_tw_video/776222315440959488/pu/vid/180x320/jHDIO9O5RH5p-xN-.mp4' type='video/mp4'></video>"
            },
            galleryAttachmentListView,
            tiledAttachmentEl,
            content;

            beforeEach(function() {
                content = new Content();
                galleryAttachmentListView = new GalleryAttachmentListView({ content: content, attachmentToFocus: oembedVideoAttachment });

                galleryAttachmentListView.setElement($('<div></div>'));
                galleryAttachmentListView.render();
                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, oembedVideoAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
                tiledAttachmentEl = galleryAttachmentListView.$el.find('.content-attachment:first');
            });

            it('shows the video player as the focused attachment and does not break if there is no provider_name', function() {
                content = new Content();
                galleryAttachmentListView = new GalleryAttachmentListView({ content: content, attachmentToFocus: noRelatedVideoAttachment });

                galleryAttachmentListView.setElement($('<div></div>'));
                galleryAttachmentListView.render();
                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, noProviderNameAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
                tiledAttachmentEl = galleryAttachmentListView.$el.find('.content-attachment:first');
                tiledAttachmentEl.trigger('click');
                var focusedAttachmentsEl = galleryAttachmentListView.$el.find('.content-attachments-gallery');
                var focusedVideoAttachmentEl = focusedAttachmentsEl.find('.content-attachment:first .content-attachment-video');
                expect(focusedVideoAttachmentEl).not.toBeEmpty();
                expect(focusedVideoAttachmentEl).toBe('div');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachments-focused');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachment-video');
                expect(focusedVideoAttachmentEl).toHaveCss({ display: 'block' });
                expect($(focusedVideoAttachmentEl).find('iframe').attr('src')).not.toContain('autoplay=1');
                expect($(focusedVideoAttachmentEl).find('iframe').attr('src')).not.toContain('%26rel%3D0');
            });

            it('shows the video player as the focused attachment and auto plays youtube and no related content at the end', function() {
                tiledAttachmentEl.trigger('click');
                var focusedAttachmentsEl = galleryAttachmentListView.$el.find('.content-attachments-gallery');
                var focusedVideoAttachmentEl = focusedAttachmentsEl.find('.content-attachment:first .content-attachment-video');
                expect(focusedVideoAttachmentEl).not.toBeEmpty();
                expect(focusedVideoAttachmentEl).toBe('div');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachments-focused');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachment-video');
                expect(focusedVideoAttachmentEl).toHaveCss({ display: 'block' });
                expect($(focusedVideoAttachmentEl).find('iframe').attr('src')).toContain('autoplay=1');
                expect($(focusedVideoAttachmentEl).find('iframe').attr('src')).toContain('%26rel%3D0');
            });

            it('adds a poster to video tags', function () {
                content = new Content();
                galleryAttachmentListView = new GalleryAttachmentListView({
                    content: content,
                    attachmentToFocus: rawVideoAttachment
                });

                galleryAttachmentListView.setElement($('<div></div>'));
                galleryAttachmentListView.render();
                var attachment = $.extend({}, noAutoplayVideoAttachment);
                attachment.id = 1;
                content.addAttachment(attachment);
                tiledAttachmentEl = galleryAttachmentListView.$el.find('.content-attachment:first');
                tiledAttachmentEl.trigger('click');

                var focusedAttachmentsEl = galleryAttachmentListView.$el.find('.content-attachments-gallery');
                var focusedVideoAttachmentEl = focusedAttachmentsEl.find('.content-attachment:first .content-attachment-video');
                expect($(focusedVideoAttachmentEl).find('video').attr('poster')).toBe(rawVideoAttachment.thumbnail_url);
            });

            it('does not auto play non Youtube and Livefyre videos', function() {
                content = new Content();
                galleryAttachmentListView = new GalleryAttachmentListView({ content: content, attachmentToFocus: noRelatedVideoAttachment });

                galleryAttachmentListView.setElement($('<div></div>'));
                galleryAttachmentListView.render();
                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, noAutoplayVideoAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
                tiledAttachmentEl = galleryAttachmentListView.$el.find('.content-attachment:first');
                tiledAttachmentEl.trigger('click');
                var focusedAttachmentsEl = galleryAttachmentListView.$el.find('.content-attachments-gallery');
                var focusedVideoAttachmentEl = focusedAttachmentsEl.find('.content-attachment:first .content-attachment-video');
                expect(focusedVideoAttachmentEl).not.toBeEmpty();
                expect(focusedVideoAttachmentEl).toBe('div');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachments-focused');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachment-video');
                expect(focusedVideoAttachmentEl).toHaveCss({ display: 'block' });
                expect($(focusedVideoAttachmentEl).find('iframe').attr('src')).not.toContain('autoplay=1');
                expect($(focusedVideoAttachmentEl).find('iframe').attr('src')).not.toContain('%26rel%3D0');
            });

            it('does show related videos at end of non Youtube and Livefyre videos', function() {
                content = new Content();
                galleryAttachmentListView = new GalleryAttachmentListView({ content: content, attachmentToFocus: noAutoplayVideoAttachment });

                galleryAttachmentListView.setElement($('<div></div>'));
                galleryAttachmentListView.render();
                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, noAutoplayVideoAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
                tiledAttachmentEl = galleryAttachmentListView.$el.find('.content-attachment:first');
                tiledAttachmentEl.trigger('click');
                var focusedAttachmentsEl = galleryAttachmentListView.$el.find('.content-attachments-gallery');
                var focusedVideoAttachmentEl = focusedAttachmentsEl.find('.content-attachment:first .content-attachment-video');
                expect(focusedVideoAttachmentEl).not.toBeEmpty();
                expect(focusedVideoAttachmentEl).toBe('div');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachments-focused');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachment-video');
                expect(focusedVideoAttachmentEl).toHaveCss({ display: 'block' });
                expect($(focusedVideoAttachmentEl).find('iframe').attr('src')).not.toContain('autoplay=1');
                expect($(focusedVideoAttachmentEl).find('iframe').attr('src')).not.toContain('%26rel%3D0');
            });
        });

        describe('when attachment is focused', function() {
            var galleryAttachmentListView,
                content,
                attachmentListViewOpts;

            beforeEach(function() {
                content = new Content();
                attachmentListViewOpts = { content: content, attachmentToFocus: oembedAttachment };
                galleryAttachmentListView = new GalleryAttachmentListView(attachmentListViewOpts);
                galleryAttachmentListView.setElement($('<div></div>'));
                galleryAttachmentListView.render();
                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    var attachment = $.extend({}, oembedAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
            });

            it('the focused element displayed', function() {
                expect(galleryAttachmentListView.$el.find(galleryAttachmentListView.focusedAttachmentsSelector)).toBe('div');
            });

            it('displays the next attachment when right arrow key is pressed', function() {
                spyOn(galleryAttachmentListView, 'next');
                $(window).trigger($.Event('keyup', {keyCode: 39}));
                expect(galleryAttachmentListView.next).toHaveBeenCalled();
            });

            it('displays the next attachment when next button is clicked', function() {
                spyOn(galleryAttachmentListView, 'next');
                galleryAttachmentListView.$el.find(galleryAttachmentListView.galleryNextSelector).trigger('click');
                expect(galleryAttachmentListView.next).toHaveBeenCalled();
            });

            it('displays the next attachment when the focused attachment is clicked', function() {

            });

            it('displays the previous attachment when left arrow key is pressed', function() {
                spyOn(galleryAttachmentListView, 'prev');
                $(window).trigger($.Event('keyup', {keyCode: 37}));
                expect(galleryAttachmentListView.prev).toHaveBeenCalled();

            });

            it('displays the previous attachment when previous button is clicked', function() {
                spyOn(galleryAttachmentListView, 'prev');
                galleryAttachmentListView.$el.find(galleryAttachmentListView.galleryPrevSelector).trigger('click');
                expect(galleryAttachmentListView.prev).toHaveBeenCalled();
            });

            describe('when there is 1 attachment', function () {
            });

            describe('when there is > 1 attachment', function () {
            });
        });

    });

});
