define([
    'jquery',
    'jasmine',
    'jasmine-jquery',
    'streamhub-sdk/content/content',
    'streamhub-sdk/content/views/gallery-attachment-list-view',
    'streamhub-sdk/content/views/oembed-view'],
function($, jasmine, jasminejQuery, Content, GalleryAttachmentListView, OembedView) {

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

            describe('with opts.pageButons', function() {
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
                var galleryAttachmentListView = new GalleryAttachmentListView({ content: content, toFocus: oembedAttachment });
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

                it('has a page count (e.g. 1 of 5)', function() {
                    expect(galleryAttachmentListView.$el.find('.content-attachments-gallery-count')).toBe('div');
                });
            });
        });

        describe('when clicking a thumbnail', function() {
            
            var galleryAttachmentListView,
                tiledAttachmentEl,
                content = new Content(),
                attachmentListViewOpts = { content: content, toFocus: oembedAttachment};

            it('emits focusAttachment.hub event', function() {
                galleryAttachmentListView = new GalleryAttachmentListView(attachmentListViewOpts);
                galleryAttachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    var attachment = $.extend({}, oembedAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
                tiledAttachmentEl = galleryAttachmentListView.$el.find('.content-attachments-gallery-thumbnails .content-attachment:first');

                var spyFocusAttachmentEvent = spyOnEvent(tiledAttachmentEl[0], 'focusAttachment.hub');
                var tileClicked = false;
                galleryAttachmentListView.$el.on('focusAttachment.hub', function() {
                    tileClicked = true;
                });

                tiledAttachmentEl.trigger('click');
                expect(tileClicked).toBe(true);
                expect(spyFocusAttachmentEvent).toHaveBeenTriggered();
            });
        });

        describe ('when focusing a tiled video attachment', function() {
            var oembedVideoAttachment = {
                provider_name: "YouTube",
                provider_url: "http://youtube.com",
                type: "video",
                thumbnail_url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg",
                html: "<iframe>here's your video player</iframe>"
            },
            galleryAttachmentListView,
            tiledAttachmentEl,
            content;
           
            beforeEach(function() {
                content = new Content();
                galleryAttachmentListView = new GalleryAttachmentListView({ content: content, toFocus: oembedVideoAttachment });

                galleryAttachmentListView.setElement($('<div></div>'));
                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, oembedVideoAttachment);
                    attachment.id = i;
                    content.addAttachment(attachment);
                }
                tiledAttachmentEl = galleryAttachmentListView.$el.find('.content-attachment:first');
            });

            it('shows the video player as the focused attachment', function() {
                tiledAttachmentEl.trigger('click');
                var focusedAttachmentsEl = galleryAttachmentListView.$el.find('.content-attachments-gallery');
                var focusedVideoAttachmentEl = focusedAttachmentsEl.find('.content-attachment:first .content-attachment-video');
                expect(focusedVideoAttachmentEl).not.toBeEmpty();
                expect(focusedVideoAttachmentEl).toHaveHtml($('<div></div>').append($(oembedVideoAttachment.html).css({'width': '100%', 'height': '100%'})).html());
                expect(focusedVideoAttachmentEl).toHaveCss({ display: 'block' });
            });
        });
    });

});

