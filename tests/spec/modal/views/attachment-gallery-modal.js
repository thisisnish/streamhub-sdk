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

        describe('#updateAttachmentHeight', function () {
            var attachmentOpts = {
                focusedAttachmentHeight: 700,
                focusedAttachmentWidth: 600,
                height: 600,
                modalHorizontalWhitespace: 0,
                modalVerticalWhitespace: 0,
                width: 600
            };
            var clonedOpts;
            var modalView;
            var sizes;

            beforeEach(function () {
                clonedOpts = $.extend({}, attachmentOpts);
                modalView = new AttachmentGalleryModal();
            });

            it('keeps the aspect ratio', function () {
                expect(modalView.updateAttachmentHeight(attachmentOpts)).toEqual({
                    height: '450px',
                    width: '386px'
                });
            });

            it('keeps both height and width at or below the threshold', function () {
                sizes = modalView.updateAttachmentHeight(clonedOpts);
                expect(parseInt(sizes.height.split('px')[0]) / clonedOpts.height <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0]) / clonedOpts.width <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
            });

            it('calls the width function if the newly generated width is larger than the width of the screen', function () {
                spyOn(modalView, 'updateAttachmentWidth').andCallThrough();
                clonedOpts.focusedAttachmentWidth = 1000;
                sizes = modalView.updateAttachmentHeight(clonedOpts);
                expect(modalView.updateAttachmentWidth).toHaveBeenCalled();
                expect(parseInt(sizes.height.split('px')[0]) / clonedOpts.height <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0]) / clonedOpts.width <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
            });

            it('skips the width function if force is passed', function () {
                spyOn(modalView, 'updateAttachmentWidth');
                clonedOpts.focusedAttachmentWidth = 1000;
                clonedOpts.force = true;
                sizes = modalView.updateAttachmentHeight(clonedOpts);
                expect(modalView.updateAttachmentWidth).not.toHaveBeenCalled();
                expect(parseInt(sizes.height.split('px')[0]) / clonedOpts.height <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0]) / clonedOpts.width >= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
            });
        });

        describe('#updateAttachmentWidth', function () {
            var attachmentOpts = {
                focusedAttachmentHeight: 600,
                focusedAttachmentWidth: 700,
                height: 600,
                modalHorizontalWhitespace: 0,
                modalVerticalWhitespace: 0,
                width: 600
            };
            var clonedOpts;
            var modalView;
            var sizes;

            beforeEach(function () {
                clonedOpts = $.extend({}, attachmentOpts);
                modalView = new AttachmentGalleryModal();
            });

            it('keeps the aspect ratio', function () {
                expect(modalView.updateAttachmentWidth(attachmentOpts)).toEqual({
                    height: '386px',
                    width: '450px'
                });
            });

            it('keeps both height and width at or below the threshold', function () {
                sizes = modalView.updateAttachmentWidth(clonedOpts);
                expect(parseInt(sizes.height.split('px')[0]) / clonedOpts.height <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0]) / clonedOpts.width <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
            });

            it('calls the height function if the newly generated height is larger than the height of the screen', function () {
                spyOn(modalView, 'updateAttachmentHeight').andCallThrough();
                clonedOpts.focusedAttachmentHeight = 1000;
                sizes = modalView.updateAttachmentWidth(clonedOpts);
                expect(modalView.updateAttachmentHeight).toHaveBeenCalled();
                expect(parseInt(sizes.height.split('px')[0]) / clonedOpts.height <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0]) / clonedOpts.width <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
            });

            it('skips the height function if force is passed', function () {
                spyOn(modalView, 'updateAttachmentHeight');
                clonedOpts.focusedAttachmentHeight = 1000;
                clonedOpts.force = true;
                sizes = modalView.updateAttachmentWidth(clonedOpts);
                expect(modalView.updateAttachmentHeight).not.toHaveBeenCalled();
                expect(parseInt(sizes.height.split('px')[0]) / clonedOpts.height >= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
                expect(parseInt(sizes.width.split('px')[0]) / clonedOpts.width <= AttachmentGalleryModal.ATTACHMENT_MAX_SIZE).toBe(true);
            });
        });
    });
});
