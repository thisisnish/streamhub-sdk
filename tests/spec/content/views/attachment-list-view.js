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

        describe('when constructed', function() {

            describe('with no arguments or options', function() {
                var attachmentListView = new AttachmentListView();
                it('is instance of AttachmentListView', function() {
                    expect(attachmentListView).toBeDefined();
                    expect(attachmentListView instanceof AttachmentListView).toBe(true);
                }); 
            });
        });

        describe('when adding an attachment', function() {

            it('increments the attachment count', function() {
                var attachmentListView = new AttachmentListView();
                expect(attachmentListView.count()).toBe(0);
                attachmentListView.add(oembedAttachment);
                expect(attachmentListView.count()).toBe(1);
            });

            describe('creates an attachment view', function() {
                var attachmentListView = new AttachmentListView();
                var oembedView = attachmentListView.createOembedView(oembedAttachment);
                it('is instance of OembedView', function() {
                    expect(oembedView).toBeDefined();
                    expect(oembedView instanceof OembedView).toBe(true);
                });

                describe('with photo attachment', function() {
                    var attachmentListView = new AttachmentListView();
                    attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                    oembedAttachment.type = 'photo';
                    var oembedView = attachmentListView.createOembedView(oembedAttachment);
                    oembedView.render();

                    it('is a tiled attachment (appended to .content-attachments-tiled)', function() {
                        expect(attachmentListView.$el.find('.content-attachments-tiled')).toContain('.content-attachment');
                        expect(attachmentListView.$el.find('.content-attachments-stacked')).toBeEmpty();
                    });
                });

                describe('with video attachment', function() {
                    var attachmentListView = new AttachmentListView();
                    attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                    oembedAttachment.type = 'video';
                    var oembedView = attachmentListView.createOembedView(oembedAttachment);
                    oembedView.render();

                    it('is a tiled attachment (appended to .content-attachments-tiled)', function() {
                        expect(attachmentListView.$el.find('.content-attachments-tiled')).toContain('.content-attachment');
                        expect(attachmentListView.$el.find('.content-attachments-stacked')).toBeEmpty();
                    });
                });

                describe('with link attachment', function() {
                    var attachmentListView = new AttachmentListView();
                    attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                    oembedAttachment.type = 'link';
                    var oembedView = attachmentListView.createOembedView(oembedAttachment);
                    oembedView.render();

                    it('is a stacked attachment (appended to .content-attachments-stacked)', function() {
                        expect(attachmentListView.$el.find('.content-attachments-stacked')).toContain('.content-attachment');
                        expect(attachmentListView.$el.find('.content-attachments-tiled')).toBeEmpty();
                    });
                });

                describe('with rich attachment', function() {
                    var attachmentListView = new AttachmentListView();
                    attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                    oembedAttachment.type = 'rich';
                    var oembedView = attachmentListView.createOembedView(oembedAttachment);
                    oembedView.render();

                    it('is a stacked attachment (appended to .content-attachments-stacked)', function() {
                        expect(attachmentListView.$el.find('.content-attachments-stacked')).toContain('.content-attachment');
                        expect(attachmentListView.$el.find('.content-attachments-tiled')).toBeEmpty();
                    });
                });
            });
        });

        describe('when removing an attachment', function() {

            it ('decrements the attachment count', function() {
                var attachmentListView = new AttachmentListView()
                attachmentListView.add(oembedAttachment);

                expect(attachmentListView.count()).toBe(1);
                attachmentListView.remove(oembedAttachment);
                expect(attachmentListView.count()).toBe(0);
            });

            describe('retrieves OembedView given an attachment', function() {
                var attachmentListView = new AttachmentListView()
                attachmentListView.add(oembedAttachment);

                it ('is corresponding OembedView of the attachment object', function() {
                    var oembedView = attachmentListView.getOembedView(oembedAttachment);
                    expect(oembedView == attachmentListView.oembedViews[0]).toBe(true);
                });
            });
        });

        describe('when rendering', function() {

            describe('with 1 tiled attachment', function() {
                var attachmentListView = new AttachmentListView();
                attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                oembedAttachment.type = 'photo';
                attachmentListView.add(oembedAttachment);

                it('has .content-attachments-1 class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toHaveClass('content-attachments-1');
                });
            });

            describe('with 2 tiled attachments', function() {
                var attachmentListView = new AttachmentListView();
                attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 2; i++) {
                    attachmentListView.add(oembedAttachment);
                }

                it('has .content-attachments-2 class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toHaveClass('content-attachments-2');
                });
            });

            describe('with 3 tiled attachments', function() {
                var attachmentListView = new AttachmentListView();
                attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 3; i++) {
                    attachmentListView.add(oembedAttachment);
                }

                it('has .content-attachments-3 class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toHaveClass('content-attachments-3');
                });
            });

            describe('with 4 tiled attachments', function() {
                var attachmentListView = new AttachmentListView();
                attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 4; i++) {
                    attachmentListView.add(oembedAttachment);
                }

                it('has .content-attachments-4 class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')).toHaveClass('content-attachments-4');
                });
            });

            describe('with > 4 tiled attachments', function() {
                var attachmentListView = new AttachmentListView();
                attachmentListView.setElement($('<div><div class="content-attachments-tiled"></div><div class="content-attachments-stacked"></div></div>'));
                oembedAttachment.type = 'photo';
                for (var i=0; i < 9; i++) {
                    attachmentListView.add(oembedAttachment);
                }

                it('has only .content-attachments-tiled class name', function() {
                    expect(attachmentListView.$el.find('.content-attachments-tiled')[0].className).toBe('content-attachments-tiled');
                });
            });
        });
    });

});

