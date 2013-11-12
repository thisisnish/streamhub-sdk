define([
    'streamhub-sdk/jquery',
    'jasmine',
    'streamhub-sdk/views/list-view',
    'streamhub-sdk/view',
    'jasmine-jquery'],
function ($, jasmine, ListView, View) {
    'use strict';

    describe('List-View', function () {
        
        describe('when containing rendered content', function () {
            var list,
                view;
            beforeEach(function () {
                view = new View();
                list = new ListView();
                list.add(view);
                
                expect(list.views.length).toBe(1);
                expect(list.$listEl[0].children.length).toBe(1);
            });
            
            it("removes content on 'removeView.hub'", function () {
                view.$el.trigger('removeView.hub', view);
                
                expect(list.views.length).toBe(0);
                expect(list.$listEl[0].children.length).toBe(0);
            });
        });
    });
});
