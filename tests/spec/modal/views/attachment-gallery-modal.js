define([
    'jquery',
    'streamhub-sdk/content',
    'streamhub-sdk/content/types/oembed',
    'streamhub-sdk/content/views/oembed-view',
    'streamhub-sdk/content/views/gallery-attachment-list-view',
    'streamhub-sdk/modal/views/attachment-gallery-modal'],
function($, Content, Oembed, OembedView, GalleryAttachmentListView, AttachmentGalleryModal) {
    'use strict';

    describe('AttachmentGalleryModal', function () {
        var oembedAttachment = {
            provider_name: "Twimg",
            provider_url: "http://pbs.twimg.com",
            type: "photo",
            url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg"
        };

        describe('when constructed', function () {
            describe('with no arguments or options', function () {
                var modalView;

                beforeEach(function () {
                    modalView = new AttachmentGalleryModal();
                });

                it('is instance of AttachmentGalleryModal', function() {
                    expect(modalView).toBeDefined();
                    expect(modalView instanceof AttachmentGalleryModal).toBe(true);
                });
            });
        });

        describe('when showing content', function () {
            var modalView;
            var content;

            beforeEach(function () {
                content = new Content();
                modalView = new AttachmentGalleryModal();
                modalView.setElement($('<div></div>'));
            });

            it('sets a content instance on the modal content view', function () {
                modalView.show(new GalleryAttachmentListView({ content: content }));
                expect(modalView._modalSubView.content).toBe(content);
            });

            it('sets the focused attachment on the modal content view', function () {
                var attachment = new Oembed();
                modalView.show(new GalleryAttachmentListView({
                    content: content,
                    attachmentToFocus: attachment
                }));
                expect(modalView._modalSubView.content).toBe(content);
                expect(modalView._modalSubView._focusedAttachment).toBe(attachment);
            });
        });

        describe('when focusing a tiled video attachment', function () {
            var oembedVideoAttachment = {
                provider_name: "YouTube",
                provider_url: "http://youtube.com",
                type: "video",
                thumbnail_url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg",
                html: "<iframe>here's your video player</iframe>"
            };
            var modalView;
            var tiledAttachmentEl;
            var content;

            beforeEach(function() {
                content = new Content();
                modalView = new AttachmentGalleryModal();
                modalView.setElement($('<div></div>'));
                modalView.show(new GalleryAttachmentListView({
                    content: content,
                    attachmentToFocus: oembedVideoAttachment
                }));

                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, oembedVideoAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
                tiledAttachmentEl = modalView.$el.find('.content-attachment:first');
            });

            afterEach(function () {
                modalView.hide();
            });

            it('shows the video player as the focused attachment', function() {
                tiledAttachmentEl.trigger('click');
                var focusedAttachmentsEl = modalView.$el.find('.content-attachments-gallery');
                var focusedVideoAttachmentEl = focusedAttachmentsEl.find('.content-attachment:first .content-attachment-video');
                expect(focusedVideoAttachmentEl).not.toBeEmpty();
                expect(focusedVideoAttachmentEl).toBe('div');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachments-focused');
                expect(focusedVideoAttachmentEl).toHaveClass('content-attachment-video');
            });
        });

        describe('when attachment is focused', function() {
            var modalView;

            beforeEach(function() {
                var content = new Content();
                modalView = new AttachmentGalleryModal();
                modalView.setElement($('<div></div>'));
                modalView.show(new GalleryAttachmentListView({
                    content: content,
                    attachmentToFocus: oembedAttachment
                }));

                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    var attachment = $.extend({}, oembedAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
            });

            afterEach(function () {
                modalView.hide();
            });

            it('the focused element displayed', function() {
                expect(modalView.$el.find('.content-attachments-gallery-focused')).toBe('div');
            });
        });

        describe('#updateAttachmentToFitModal', function () {
            var attachmentOpts = {
                focusedAttachmentHeight: 600,
                focusedAttachmentWidth: 700,
                height: 600,
                modalHorizontalWhitespace: 0,
                modalVerticalWhitespace: 0,
                width: 600
            };
            var clonedOpts;
            var MAX_SIZE = AttachmentGalleryModal.ATTACHMENT_MAX_SIZE;
            var MOBILE_MAX_SIZE = AttachmentGalleryModal.ATTACHMENT_MAX_SIZE_WITH_PADDING;
            var modalView;
            var sizes;

            beforeEach(function () {
                clonedOpts = $.extend({}, attachmentOpts);
                modalView = new AttachmentGalleryModal();
            });

            it('keeps the aspect ratio', function () {
                var sizes = modalView.updateAttachmentToFitModal(attachmentOpts);
                expect(sizes).toEqual({height: '386px', width: '450px'});
                expect(parseInt(sizes.height.split('px')[0], 10) / attachmentOpts.height < MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0], 10) / attachmentOpts.width <= MAX_SIZE).toBe(true);
            });

            it('uses aspectRatio to calculate new size', function () {
                clonedOpts.aspectRatio = {height: ((9/16) * 100).toFixed(2), width: 100};
                var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                expect(sizes).toEqual({height: '253px', width: '450px'});
                expect(parseInt(sizes.height.split('px')[0], 10) / attachmentOpts.height < MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0], 10) / attachmentOpts.width <= MAX_SIZE).toBe(true);
            });

            it('uses aspectRatio to calculate new size on mobile', function () {
                modalView._isMobile = true;
                clonedOpts.aspectRatio = {height: ((9/16) * 100).toFixed(2), width: 100};
                var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                expect(sizes).toEqual({height: '304px', width: '540px'});
                expect(parseInt(sizes.height.split('px')[0], 10) / attachmentOpts.height <= MOBILE_MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0], 10) / attachmentOpts.width <= MOBILE_MAX_SIZE).toBe(true);
            });

            it('increases the size of small youtube videos', function () {
                clonedOpts.focusedAttachmentHeight = 225;
                clonedOpts.focusedAttachmentWidth = 400;
                var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                expect(sizes).toEqual({height: '253px', width: '450px'});
                expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
            });

            describe('works without an aspect ratio', function () {
                it('height >> width', function () {
                    clonedOpts.height = 1000;
                    clonedOpts.width = 400;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '257px', width: '300px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
                });

                it('height > width', function () {
                    clonedOpts.height = 750;
                    clonedOpts.width = 400;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '257px', width: '300px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
                });

                it('height < width', function () {
                    clonedOpts.height = 400;
                    clonedOpts.width = 750;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '294px', width: '343px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
                });

                it('height << width', function () {
                    clonedOpts.height = 400;
                    clonedOpts.width = 1000;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '300px', width: '350px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
                });
            });

            describe('works with all screen sizes', function () {
                beforeEach(function () {
                    clonedOpts.aspectRatio = {height: ((9/16) * 100).toFixed(2), width: 100};
                });

                it('height >> width', function () {
                    clonedOpts.height = 1000;
                    clonedOpts.width = 400;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '169px', width: '300px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
                });

                it('height > width', function () {
                    clonedOpts.height = 750;
                    clonedOpts.width = 400;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '169px', width: '300px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
                });

                it('height < width', function () {
                    clonedOpts.height = 400;
                    clonedOpts.width = 750;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '300px', width: '533px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
                });

                it('height << width', function () {
                    clonedOpts.height = 400;
                    clonedOpts.width = 1000;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '298px', width: '530px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MAX_SIZE).toBe(true);
                });
            });

            describe('works with specific use cases', function () {
                it('mobile, square aspect ration, landscape orientation, wide video', function () {
                    modalView._isMobile = true;
                    clonedOpts.aspectRatio = {height: 100, width: 100};
                    clonedOpts.focusedAttachmentHeight = 315;
                    clonedOpts.focusedAttachmentWidth = 560;
                    clonedOpts.height = 375;
                    clonedOpts.modalHorizontalWhitespace = 0;
                    clonedOpts.modalVerticalWhitespace = 144;
                    clonedOpts.width = 667;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '257px', width: '456px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MOBILE_MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MOBILE_MAX_SIZE).toBe(true);
                });

                it('mobile, square aspect ratio, landscape orientation, tall video', function () {
                    modalView._isMobile = true;
                    clonedOpts.aspectRatio = {height: 100, width: 100};
                    clonedOpts.focusedAttachmentHeight = 360;
                    clonedOpts.focusedAttachmentWidth = 202;
                    clonedOpts.height = 375;
                    clonedOpts.modalHorizontalWhitespace = 0;
                    clonedOpts.modalVerticalWhitespace = 144;
                    clonedOpts.width = 667;
                    var sizes = modalView.updateAttachmentToFitModal(clonedOpts);
                    expect(sizes).toEqual({height: '194px', width: '109px'});
                    expect(parseInt(sizes.height.split('px')[0], 10) / clonedOpts.height <= MOBILE_MAX_SIZE).toBe(true);
                    expect(parseInt(sizes.width.split('px')[0], 10) / clonedOpts.width <= MOBILE_MAX_SIZE).toBe(true);
                });
            });
        });
    });
});
