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
    });
});
