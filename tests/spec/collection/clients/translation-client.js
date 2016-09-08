var LivefyreTranslationClient = require('streamhub-sdk/collection/clients/translation-client');

describe('src/collection/clients/translation-client.js', function () {
    var client;

    beforeEach(function () {
        client = new LivefyreTranslationClient();
    });

    describe('#_getHost', function () {
        it('only uses tld values instead of custom network', function () {
            // PROD
            expect(client._getHost({
                network: 'client-solutions.fyre.co',
                siteId: '123'
            })).toEqual('bootstrap.livefyre.com');

            // UAT
            expect(client._getHost({
                environment: 't402.livefyre.com',
                network: 'client-solutions-uat.fyre.co',
                siteId: '123'
            })).toEqual('bootstrap.t402.livefyre.com');
        });

        it('has a special case for localdev', function () {
            expect(client._getHost({
                environment: 'fyre',
                network: 'livefyre.com',
                siteId: '123'
            })).toEqual('bsserver.fyre');
        });
    });

    describe('#getTranslations', function () {
        beforeEach(function () {
            spyOn(client, '_request');
        });

        it('builds the correct non-dev url', function () {
            client.getTranslations({
                language: 'abc',
                network: 'livefyre.com',
                siteId: '123'
            });
            expect(client._request.calls.length).toEqual(1);
            expect(client._request.mostRecentCall.args[0]).toEqual({
                data: 'section=translations&translations.app=date&translations.lang_code=abc',
                url: 'https://bootstrap.livefyre.com/api/v4/configuration/livefyre.com/site/123/'
            });
        });

        it('builds the correct dev url', function () {
            client.getTranslations({
                environment: 'fyre',
                language: 'abc',
                network: 'livefyre.com',
                siteId: '123'
            });
            expect(client._request.calls.length).toEqual(1);
            expect(client._request.mostRecentCall.args[0]).toEqual({
                data: 'section=translations&translations.app=date&translations.lang_code=abc',
                url: 'https://bsserver.fyre/api/v4/configuration/livefyre.com/site/123/'
            });
        });

        it('has the correct query params', function () {
            client.getTranslations({
                appType: 'streamhub-wall',
                language: 'abc',
                network: 'livefyre.com',
                siteId: '123'
            });
            expect(client._request.calls.length).toEqual(1);
            expect(client._request.mostRecentCall.args[0].data).toEqual('section=translations&translations.app=date&translations.app=streamhub-wall&translations.lang_code=abc');
        });

        it('uses the window.navigator language value if no `language` is provided', function () {
            spyOn(window, 'navigator');
            window.navigator.language = 'def';

            client.getTranslations({
                appType: 'streamhub-wall',
                network: 'livefyre.com',
                siteId: '123'
            });
            expect(client._request.calls.length).toEqual(1);
            expect(client._request.mostRecentCall.args[0].data).toEqual('section=translations&translations.app=date&translations.app=streamhub-wall&translations.lang_code=def');
        });
    });
});
