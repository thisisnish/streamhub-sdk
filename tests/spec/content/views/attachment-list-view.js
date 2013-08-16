define([
    'jquery',
    'jasmine',
    'jasmine-jquery',
    'streamhub-sdk/content/content',
    'streamhub-sdk/content/views/attachment-list-view',
    'streamhub-sdk/content/views/oembed-view'],
function($, jasmine, jasminejQuery, Content, AttachmentListView, OembedView) {

    describe('AttachmentListView', function () {
        var oembedAttachment = {
            provider_name: "Twimg",
            provider_url: "http://pbs.twimg.com",
            type: "photo",
            url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg"
        };
        var content = new Content({ body: 'what' });

        describe('when constructed', function() {

            describe('with no arguments or options', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                it('is instance of AttachmentListView', function() {
                    expect(attachmentListView).toBeDefined();
                    expect(attachmentListView instanceof AttachmentListView).toBe(true);
                }); 
            });
        });

        describe('when adding an attachment', function() {

            it('increments the attachment count', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                expect(attachmentListView.count()).toBe(0);
                attachmentListView.add(oembedAttachment);
                expect(attachmentListView.count()).toBe(1);
            });

            describe('creates an attachment view', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                var oembedView = attachmentListView.createOembedView(oembedAttachment);
                it('is instance of OembedView', function() {
                    expect(oembedView).toBeDefined();
                    expect(oembedView instanceof OembedView).toBe(true);
                });
            });

            describe('with photo attachment', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                attachmentListView.add(oembedAttachment);

                it('is a tiled attachment (appended to .content-attachments-tiled)', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toContain('.content-attachment');
                    expect(attachmentListView.$el.find('.content-attachments-stacked')).toBeEmpty();
                });
            });

            describe('with video attachment', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'video';
                attachmentListView.add(oembedAttachment);

                it('is a tiled attachment (appended to .content-attachments-tiled)', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toContain('.content-attachment');
                    expect(attachmentListView.$el.find('.content-attachments-stacked')).toBeEmpty();
                });
            });

            describe('with link attachment', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'link';
                attachmentListView.add(oembedAttachment);

                it('is a stacked attachment (appended to .content-attachments-stacked)', function() {
                    expect(attachmentListView.$el.find('.content-attachments-stacked')).toContain('.content-attachment');
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toBeEmpty();
                });
            });

            describe('with rich attachment', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'rich';
                attachmentListView.add(oembedAttachment);

                it('is a stacked attachment (appended to .content-attachments-stacked)', function() {
                    expect(attachmentListView.$el.find('.content-attachments-stacked')).toContain('.content-attachment');
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toBeEmpty();
                });
            });
        });

        describe('when removing an attachment', function() {

            it ('decrements the attachment count', function() {
                var attachmentListView = new AttachmentListView({ content: content })
                attachmentListView.add(oembedAttachment);

                expect(attachmentListView.count()).toBe(1);
                attachmentListView.remove(oembedAttachment);
                expect(attachmentListView.count()).toBe(0);
            });

            describe('retrieves OembedView given an attachment', function() {
                var attachmentListView = new AttachmentListView({ content: content })
                attachmentListView.add(oembedAttachment);

                it ('is corresponding OembedView of the attachment object', function() {
                    var oembedView = attachmentListView.getOembedView(oembedAttachment);
                    expect(oembedView == attachmentListView.oembedViews[0]).toBe(true);
                });
            });
        });

        describe('when rendering', function() {

            describe('with 1 tiled attachment', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                attachmentListView.add(oembedAttachment);

                it('has .content-attachments-1 class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toHaveClass('content-attachments-1');
                    expect(attachmentListView.$el.find('.content-attachments-tiled .content-attachment')).toHaveClass('content-attachment-square-tile');
                });
            });

            describe('with 2 tiled attachments', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 2; i++) {
                    attachmentListView.add(oembedAttachment);
                }

                it('has .content-attachments-2 class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toHaveClass('content-attachments-2');
                    expect(attachmentListView.$el.find('.content-attachments-tiled .content-attachment')).toHaveClass('content-attachment-square-tile');
                });
            });

            describe('with 3 tiled attachments', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    attachmentListView.add(oembedAttachment);
                }

                it('has .content-attachments-3 class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toHaveClass('content-attachments-3');
                    expect(attachmentListView.$el.find('.content-attachments-tiled > *:nth-child(1) .content-attachment'))
                        .toHaveClass('content-attachment-horizontal-tile');
                    expect(attachmentListView.$el.find('.content-attachments-tiled > *:nth-child(2) .content-attachment'))
                        .toHaveClass('content-attachment-square-tile');
                    expect(attachmentListView.$el.find('.content-attachments-tiled > *:nth-child(3) .content-attachment'))
                        .toHaveClass('content-attachment-square-tile');
                });
            });

            describe('with 4 tiled attachments', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 4; i++) {
                    attachmentListView.add(oembedAttachment);
                }

                it('has .content-attachments-4 class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toHaveClass('content-attachments-4');
                    expect(attachmentListView.$el.find('.content-attachments-tiled .content-attachment')).toHaveClass('content-attachment-square-tile');
                });
            });

            describe('with > 4 tiled attachments', function() {
                var attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 9; i++) {
                    attachmentListView.add(oembedAttachment);
                }

                it('has only .content-attachments-tiled class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')[0].className).toBe('content-attachments-tiled');
                    expect(attachmentListView.$el.find('.content-attachments-tiled .content-attachment')).toHaveClass('content-attachment-horizontal-tile');
                });
            });
        });

        describe('when clicking an attachment tile', function() {
            
            var attachmentListView,
                tiledAttachmentEl,
                attachmentListViewOpts = { content: content };

            it('emits focusAttachment.hub event', function() {
                attachmentListView = new AttachmentListView(attachmentListViewOpts);
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    attachmentListView.add(oembedAttachment);
                }
                tiledAttachmentEl = attachmentListView.$el.find('.content-attachment:first');

                var spyFocusAttachmentEvent = spyOnEvent(tiledAttachmentEl[0], 'focusAttachment.hub');
                var tileClicked = false;
                attachmentListView.$el.on('focusAttachment.hub', function() {
                    tileClicked = true;
                });

                tiledAttachmentEl.trigger('click');
                expect(spyFocusAttachmentEvent).toHaveBeenTriggered();
                expect(tileClicked).toBe(true);
            });

            it('calls .focusAttachment, when opts.focusAttachment is not specified', function() {
                attachmentListView = new AttachmentListView(attachmentListViewOpts);
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    attachmentListView.add(oembedAttachment);
                }
                tiledAttachmentEl = attachmentListView.$el.find('.content-attachment:first');

                spyOn(attachmentListView, 'focusAttachment');
                tiledAttachmentEl.trigger('click');

                expect(attachmentListView.focusAttachment).toHaveBeenCalled();
            });

            it('calls opts.focusAttachment, when opts.focusAttachment is specified', function() {
                attachmentListViewOpts.focusAttachment = function() {};
                attachmentListView = new AttachmentListView(attachmentListViewOpts);
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    attachmentListView.add(oembedAttachment);
                }
                tiledAttachmentEl = attachmentListView.$el.find('.content-attachment:first');

                spyOn(attachmentListViewOpts, 'focusAttachment');
                tiledAttachmentEl.trigger('click');

                expect(attachmentListViewOpts.focusAttachment).toHaveBeenCalled();
            });
        });

        describe('when focusing a tiled attachment', function() {

            var attachmentListView,
                tiledAttachmentEl;

            beforeEach(function() {
                attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, oembedAttachment);
                    attachment.id = i;
                    attachmentListView.add(attachment);
                }
                tiledAttachmentEl = attachmentListView.$el.find('.content-attachment:first');
            });

            it('hides the .content-attachments-tiled element', function() {
                expect(tiledAttachmentsEl).not.toBeHidden();
                tiledAttachmentEl.trigger('click');
                var tiledAttachmentsEl = attachmentListView.$el.find('.content-attachments-tiled');
                expect(tiledAttachmentsEl).toBeHidden();
            });

            it('appends the .content-attachments-gallery element', function() {
                tiledAttachmentEl.trigger('click');
                var focusedAttachmentsEl = attachmentListView.$el.find('.content-attachments-gallery');
                expect(focusedAttachmentsEl).toBe('div');
            });

            it('contains the same number of gallery thumbnails as .content-attachment-tiled contains', function() {
                tiledAttachmentEl.trigger('click');
                var focusedThumbnailEls = attachmentListView.$el.find('.content-attachments-thumbnails');
                var tiledAttachmentsCount = attachmentListView.$el.find('.content-attachments-tiled .content-attachment').length;
                expect(focusedThumbnailEls.find('.content-attachment').length).toBe(tiledAttachmentsCount);
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
            attachmentListView,
            tiledAttachmentEl;
           
            beforeEach(function() {
                attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, oembedVideoAttachment);
                    attachment.id = i;
                    attachmentListView.add(attachment);
                }
                tiledAttachmentEl = attachmentListView.$el.find('.content-attachment:first');
            });

            it('hides the .content-attachments-tiled element', function() {
                expect(tiledAttachmentsEl).not.toBeHidden();
                tiledAttachmentEl.trigger('click');
                var tiledAttachmentsEl = attachmentListView.$el.find('.content-attachments-tiled');
                expect(tiledAttachmentsEl).toBeHidden();
            });

            it('shows the video player as the focused attachment', function() {
                tiledAttachmentEl.trigger('click');
                var focusedAttachmentsEl = attachmentListView.$el.find('.content-attachments-gallery');
                var focusedVideoAttachmentEl = focusedAttachmentsEl.find('.content-attachment:first .content-attachment-video');
                expect(focusedVideoAttachmentEl).not.toBeEmpty();
                expect(focusedVideoAttachmentEl).toHaveHtml($('<div></div>').append($(oembedVideoAttachment.html).css({'width': '100%', 'height': '100%'})).html());
                expect(focusedVideoAttachmentEl).toHaveCss({ display: 'block' });
            });
        });

        describe('when focusing gallery thumbnail', function() {

            var attachmentListView,
                tiledAttachmentEl,
                focusedAttachmentsEl;

            beforeEach(function() {
                attachmentListView = new AttachmentListView({ content: content });
                attachmentListView.setElement($('<div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 4; i++) {
                    var attachment = $.extend({}, oembedAttachment);
                    attachment.id = i;
                    attachmentListView.add(attachment);
                }
                tiledAttachmentEl = attachmentListView.$el.find('.content-attachment:first');
                tiledAttachmentEl.trigger('click');
                focusedAttachmentsEl = attachmentListView.$el.find('.content-attachments-gallery');
            });

            it('the clicked thumbnail becomes the focused attachment', function() {
            });
        });
    });

});

