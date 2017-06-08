define([
    'jquery',
    'streamhub-sdk/content',
    'streamhub-sdk/content/views/content-body-view'],
function($, Content, ContentBodyView) {
    'use strict';

    describe('ContentBodyView', function () {
        it('removes content title when oembed link title is the same', function () {
            var content = new Content({
                bodyHtml: "Speaking in Ohio, the Democratic presidential nominee says Trump was ‘taking from America with both hands and leaving the rest of us with the bill’",
                title: "Clinton hammers Trump on taxes: he 'represents the rigged system'",
                createdAt: 1359696267,
                attachments: [{
                    "provider_url": "http://theguardian.com",
                    "description": "Speaking in Ohio, the Democratic presidential nominee says Trump was ‘taking from America with both hands and leaving the rest of us with the bill’",
                    "title": "Clinton hammers Trump on taxes: he 'represents the rigged system'",
                    "url": "http://www.theguardian.com/us-news/2016/oct/03/clinton-trump-taxes-rigged-system",
                    "thumbnail_width": 1200,
                    "version": "1.0",
                    "author_name": "the Guardian",
                    "provider_name": "the Guardian",
                    "thumbnail_url": "https://i.guim.co.uk/img/media/47c7174999c49bf8dca9d18a29c63df36d300ad5/0_152_4500_2699/master/4500.jpg?w=1200&h=630&q=55&auto=format&usm=12&fit=crop&bm=normal&ba=bottom%2Cleft&blend64=aHR0cHM6Ly91cGxvYWRzLmd1aW0uY28udWsvMjAxNi8wNS8yNS9vdmVybGF5LWxvZ28tMTIwMC05MF9vcHQucG5n&s=255f1bd92f034ed14b510970ba70ef77",
                    "type": "link",
                    "thumbnail_height": 630
                }]
            });

            var el = document.createElement('div');
            var body = new ContentBodyView({content: content, el: el});
            expect(body.el.getElementsByClassName('content-has-title').length).toBe(0);
        });

        describe('truncates -- ', function () {
            it('does not truncate by default', function () {
                var body = new ContentBodyView({content: {attachments: [], body: 'this is fun'}});
                body.render();
                expect(body.$el.find('.content-body-main').html().trim()).toEqual('<p>this is fun</p>');
            });

            it('does not truncate if enabled but body is not long enough', function () {
                var body = new ContentBodyView({
                    content: {attachments: [], body: 'this is fun'},
                    showMoreEnabled: true
                });
                body.render();
                expect(body.$el.find('.content-body-main').html().trim()).toEqual('<p>this is fun</p>');
            });

            it('truncates if enabled and body is long enough', function () {
                var body = new ContentBodyView({
                    content: {attachments: [], body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. Etiam sit amet consectetur arcu. Nunc hendrerit et tortor et tempor. Quisque mattis tellus sed hendrerit aliquam. Fusce id dignissim felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce in finibus nisi. Maecenas a nisl a nibh euismod rutrum eu sit amet augue. Donec ac purus commodo, aliquet tellus molestie, efficitur odio. Etiam id vehicula lacus, varius consequat est. Mauris a tortor lacus. Maecenas eu ullamcorper tellus. Vestibulum finibus posuere velit, at pulvinar arcu faucibus ut. Proin placerat molestie elit ac ultrices.'},
                    showMoreEnabled: true
                });
                body.render();
                expect(body.$el.find('.content-body-main').html().trim()).toEqual('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. Etiam sit…<a class="content-body-show-more view-more">View More</a></p>');
            });

            it('has "view more" when truncated', function () {
                var body = new ContentBodyView({
                    content: {attachments: [], body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. Etiam sit amet consectetur arcu. Nunc hendrerit et tortor et tempor. Quisque mattis tellus sed hendrerit aliquam. Fusce id dignissim felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce in finibus nisi. Maecenas a nisl a nibh euismod rutrum eu sit amet augue. Donec ac purus commodo, aliquet tellus molestie, efficitur odio. Etiam id vehicula lacus, varius consequat est. Mauris a tortor lacus. Maecenas eu ullamcorper tellus. Vestibulum finibus posuere velit, at pulvinar arcu faucibus ut. Proin placerat molestie elit ac ultrices.'},
                    showMoreEnabled: true
                });
                body.render();
                expect(body.$el.find('.view-more').length).toBe(1);
            });

            it('has "view less" when truncated and expanded', function () {
                var body = new ContentBodyView({
                    content: {attachments: [], body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. Etiam sit amet consectetur arcu. Nunc hendrerit et tortor et tempor. Quisque mattis tellus sed hendrerit aliquam. Fusce id dignissim felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce in finibus nisi. Maecenas a nisl a nibh euismod rutrum eu sit amet augue. Donec ac purus commodo, aliquet tellus molestie, efficitur odio. Etiam id vehicula lacus, varius consequat est. Mauris a tortor lacus. Maecenas eu ullamcorper tellus. Vestibulum finibus posuere velit, at pulvinar arcu faucibus ut. Proin placerat molestie elit ac ultrices.'},
                    showMoreEnabled: true
                });
                body.render();
                body.$el.find('.view-more').click();
                expect(body.$el.find('.view-less').length).toBe(1);
            });

            it('toggles the length of the body when clicking on the "view more" button', function () {
                var body = new ContentBodyView({
                    content: {attachments: [], body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. Etiam sit amet consectetur arcu. Nunc hendrerit et tortor et tempor. Quisque mattis tellus sed hendrerit aliquam. Fusce id dignissim felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce in finibus nisi. Maecenas a nisl a nibh euismod rutrum eu sit amet augue. Donec ac purus commodo, aliquet tellus molestie, efficitur odio. Etiam id vehicula lacus, varius consequat est. Mauris a tortor lacus. Maecenas eu ullamcorper tellus. Vestibulum finibus posuere velit, at pulvinar arcu faucibus ut. Proin placerat molestie elit ac ultrices.'},
                    showMoreEnabled: true
                });
                body.render();
                expect(body.$el.find('.content-body-main').html().trim()).toEqual('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. Etiam sit…<a class="content-body-show-more view-more">View More</a></p>');

                body.$el.find('.view-more').click();
                expect(body.$el.find('.content-body-main').html().trim()).toEqual('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. Etiam sit amet consectetur arcu. Nunc hendrerit et tortor et tempor. Quisque mattis tellus sed hendrerit aliquam. Fusce id dignissim felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce in finibus nisi. Maecenas a nisl a nibh euismod rutrum eu sit amet augue. Donec ac purus commodo, aliquet tellus molestie, efficitur odio. Etiam id vehicula lacus, varius consequat est. Mauris a tortor lacus. Maecenas eu ullamcorper tellus. Vestibulum finibus posuere velit, at pulvinar arcu faucibus ut. Proin placerat molestie elit ac ultrices.<a class="content-body-show-more view-less">View Less</a></p>');

                body.$el.find('.view-less').click();
                expect(body.$el.find('.content-body-main').html().trim()).toEqual('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. Etiam sit…<a class="content-body-show-more view-more">View More</a></p>');
            });

            it('leaves html in-tact when truncating', function () {
                var body = new ContentBodyView({
                    content: {attachments: [], body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. <a href="http://google.com">Etiam sit amet consectetur arcu</a>. Nunc hendrerit et tortor et tempor. Quisque mattis tellus sed hendrerit aliquam. Fusce id dignissim felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce in finibus nisi. Maecenas a nisl a nibh euismod rutrum eu sit amet augue. Donec ac purus commodo, aliquet tellus molestie, efficitur odio. Etiam id vehicula lacus, varius consequat est. Mauris a tortor lacus. Maecenas eu ullamcorper tellus. Vestibulum finibus posuere velit, at pulvinar arcu faucibus ut. Proin placerat molestie elit ac ultrices.'},
                    showMoreEnabled: true
                });
                body.render();
                expect(body.$el.find('.content-body-main').html().trim()).toEqual('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla urna est, auctor ac laoreet ut, auctor vitae massa. <a href="http://google.com">Etiam sit…</a><a class="content-body-show-more view-more">View More</a></p>');

                body = new ContentBodyView({
                    content: {attachments: [], body: '<p>Nintendo set up a fantastic booth for Legend of Zelda: Breath of Wind here at E3 2016. Take a 360 tour of the booth in the video below.</p>'},
                    showMoreEnabled: true
                });
                body.render();
                expect(body.$el.find('.content-body-main').html().trim()).toEqual('<p>Nintendo set up a fantastic booth for Legend of Zelda: Breath of Wind here at E3 2016. Take a 360 tour of the booth in the v…<a class="content-body-show-more view-more">View More</a></p>');
            });
        });
    });
});
