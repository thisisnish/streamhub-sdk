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

        describe('when resizing a focused attachment', function () {
            var modalView;
            var content;
            var assertDimensions;

            beforeEach(function () {
                modalView = new AttachmentGalleryModal();

                var attachment = $.extend({type: 'photo'}, oembedAttachment);
                content = new Content();
                content.addAttachment(attachment);

                assertDimensions = function (width, height, imgWidth, imgHeight) {
                    modalView.setElement($('<div style="width: ' + width + 'px; height: ' + height + 'px;"></div>'));
                    modalView.show(new GalleryAttachmentListView({
                        content: content,
                        attachmentToFocus: attachment
                    }));

                    // NOTE(rrp): For some reason this is necessary (i think because the modal doesn't ever mount) when
                    // running tests all together.
                    modalView.$el.parent().appendTo(document.body);

                    modalView.resizeFocusedAttachment(2);

                    var renderedImg = modalView.$el.find(GalleryAttachmentListView.prototype.actualImageSelector);
                    expect(renderedImg.width()).toBe(imgWidth);
                    expect(renderedImg.height()).toBe(imgHeight);
                };
            });

            afterEach(function () {
                modalView.hide();
                modalView.destroy();
                // Prevent dom scroll on test run.
                window.scrollTo(0, 0);
            });

            describe('works without an aspect ratio', function () {
                it('height >> width', function () {
                    assertDimensions(400, 1000, 400, 200);
                });

                it('height > width', function () {
                    assertDimensions(400, 750, 400, 200);
                });

                it('height < width', function () {
                    assertDimensions(750, 400, 750, 375);
                });

                it('height << width', function () {
                    assertDimensions(1000, 400, 800, 400);
                });
            });
        });

        describe('when calculating attachment sizes', function () {
            var modalView;

            beforeEach(function () {
                modalView = new AttachmentGalleryModal();
            });

            afterEach(function () {
                modalView.destroy();
            });

            it('keeps the aspect ratio', function () {
                var box = modalView.maximizeDimensions([500, 400], 3/2);
                expect(box).toEqual([500, 1000/3]);
            });

            describe('works with specific use cases', function () {
                it('landscape orientation, square video', function () {
                    var box = modalView.maximizeDimensions([667, 375], 1);
                    expect(box).toEqual([375, 375]);
                });

                it('landscape orientation, tall video', function () {
                    var box = modalView.maximizeDimensions([667, 325], 202/360);
                    expect(box).toEqual([325*202/360, 325]);
                });

                it('landscape orientation, wide video', function () {
                    var box = modalView.maximizeDimensions([1355, 761], 16/9);
                    expect(box).toEqual([761*16/9, 761]);
                });

                it('portrait orientation, square video', function () {
                    var box = modalView.maximizeDimensions([761, 1355], 1);
                    expect(box).toEqual([761, 761]);
                });

                it('portrait orientation, tall video', function () {
                    var box = modalView.maximizeDimensions([761, 1355], 9/16);
                    expect(box).toEqual([761, 761*16/9]);
                });

                it('portrait orientation, wide video', function () {
                    var box = modalView.maximizeDimensions([761, 1355], 16/9);
                    expect(box).toEqual([761, 428.0625]);
                });
            });
        });
    });
});
