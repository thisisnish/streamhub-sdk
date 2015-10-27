define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/content'],
function ($, Content) {
    'use strict';

    describe('Content', function () {
        it("can be constructed with just a string", function () {
            var body = 'what';
            var content = new Content(body);
            expect(content.body).toBe(body);
        });

        it("can be constructed with opts and opts.body, opts.id and opts.title ", function () {
            var body = 'what';
            var title = 'my title';
            var content = new Content({
                body: body,
                id: '123456',
                title: title
            });
            expect(content.body).toBe(body);
            expect(content.title).toBe(title);
        });

        describe(".set", function () {
            var oldBody,
                newBody,
                oldTitle,
                newTitle,
                content,
                onChange;
            beforeEach(function () {
                oldBody = "Body text";
                newBody = "New body text";
                oldTitle = 'Title text';
                newTitle = 'New title text';
                content = new Content({
                    body: oldBody,
                    title: oldTitle
                });
                onChange = jasmine.createSpy('change listener');
            });

            it("only emits 'change' when something is changed", function () {
                content.on('change', onChange);

                content.set({body: newBody}); // Change
                content.set({body: newBody}); // Not changed

                expect(onChange).toHaveBeenCalledWith({body: newBody}, {body: oldBody});
                expect(onChange).not.toHaveBeenCalledWith({body: newBody}, {body: newBody});

                content.set({title: newTitle}); // Change
                content.set({title: newTitle}); // Not changed

                expect(onChange).toHaveBeenCalledWith({title: newTitle}, {title: oldTitle});
                expect(onChange).not.toHaveBeenCalledWith({title: newTitle}, {title: newTitle});
            });

            it("emits 'change' when objects change", function() {
                content.on('change', onChange);
                var obj = {};
                content.body = obj;
                content.set({body: obj});//Change

                expect(onChange).toHaveBeenCalled();
            });

            it("emits 'change:setting' for each setting change", function () {
                content.on('change:body', onChange);
                content.on('change:visibility', onChange);

                content.set({body: newBody, visibility: 'OWNER'});

                expect(onChange).toHaveBeenCalledWith(newBody, oldBody);
                expect(onChange).toHaveBeenCalledWith('OWNER', 'EVERYONE');
            });
        });
    });
});
