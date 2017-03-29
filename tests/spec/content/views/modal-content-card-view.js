define([
    'jquery',
    'streamhub-sdk/util',
    'streamhub-sdk/content',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/views/modal-content-card-view'],
function (
    $,
    util,
    Content,
    LivefyreContent,
    ModalContentCardView) {
    'use strict';

    describe('Default modal content card view', function () {

        describe('when constructed', function () {
            var modalView = new ModalContentCardView({ content: new Content('blah') });
            it('has a .createdAt Date', function () {
                expect(modalView.createdAt instanceof Date).toBe(true);
            });
        });

        describe('when image attachment loads', function() {
            var attachment = {
                provider_name: "Twimg",
                provider_url: "http://pbs.twimg.com",
                type: "photo",
                url: "http://pbs.twimg.com/media/BQGNgs9CEAEhmEF.jpg"
            };
            var content = new Content({ body: 'what' });
            content.addAttachment(attachment);
            var modalView = new ModalContentCardView({ content: content });

            modalView.render();
            it('has .content-with-image', function() {
                waitsFor(function() {
                    return modalView.$el.hasClass('content-with-image');
                });
                runs(function() {
                    expect(modalView.el).toHaveClass('content-with-image');
                });
            });
        });
    });
});
