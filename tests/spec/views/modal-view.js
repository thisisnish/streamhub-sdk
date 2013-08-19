define([
    'streamhub-sdk/jquery',
    'jasmine',
    'jasmine-jquery',
    'streamhub-sdk/views/modal-view'
], function($, jasmine, jasmineJquery, ModalView) {

    describe('ModalView', function() {

        describe('when constructed', function() {

            describe('with no arguments', function() {
                modalView = new ModalView();
                it('is an instance of ModalView', function() {
                    expect(modalView instanceof ModalView).toBe(true);
                });
            });
        });

        describe('when rendering', function() {

            var modalView;

            beforeEach(function() {
                modalView = new ModalView();
                modalView.render();
            });

            afterEach(function() {
                $('body > .hub-modal').remove();
            });

            it('is appended as a direct child of body element', function() {
                expect($('body > .hub-modal')).toBe('div');
            });

            it('has a close button', function() {
                expect(modalView.$el.find('.hub-modal-close')).toBe('div');
            });

            it('has an element to contain the content of the modal', function() {
                expect(modalView.$el.find('.hub-modal-content')).toBe('div');
            });
        });
    });
});
