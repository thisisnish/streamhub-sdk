var i18n = require('streamhub-sdk/i18n');

describe('src/i18n.js', function () {
    var mockTranslationResponse = {
        data: {
            translations: {
                'streamhub-wall': {
                    abc: 'def'
                }
            }
        }
    };

    beforeEach(function () {
        i18n._changed = false;
        i18n._i18n = {};
        i18n._translationMap;
    });

    describe('#fetch', function () {
        beforeEach(function () {
            spyOn(i18n._client, 'getTranslations');
        });

        it('does not get translations for livefyre.com network', function () {
            var called = false;
            i18n.once(i18n.EVENTS.RECEIVED, function () {
                called = true;
            });
            i18n.fetch({network: 'livefyre.com'});
            expect(called).toEqual(true);
            expect(i18n._client.getTranslations.callCount).toEqual(0);
        });

        it('gets translations for custom networks', function () {
            i18n.fetch({network: 'test.fyre.co'});
            expect(i18n._client.getTranslations.callCount).toEqual(1);
        });
    });

    describe('#get', function () {
        it('returns the translations', function () {
            i18n._i18n = {abc: 'def'};
            expect(i18n.get('abc')).toEqual('def');
        });
    });

    describe('#getAll', function () {
        it('returns the translations', function () {
            i18n._i18n = {abc: 'def'};
            expect(i18n.getAll()).toEqual({abc: 'def'});
        });
    });

    describe('#_handleTranslationsReceived', function () {
        it('translates data if there is no error', function () {
            spyOn(i18n, 'translate').andCallThrough();
            i18n._appType = 'streamhub-wall';
            i18n._handleTranslationsReceived(null, mockTranslationResponse);
            expect(i18n.translate.callCount).toEqual(1);
        });

        it('does not translate if error', function () {
            spyOn(i18n, 'translate').andCallThrough();
            i18n._handleTranslationsReceived({}, {});
            expect(i18n.translate.callCount).toEqual(0);
        });

        it('emits a received event', function () {
            spyOn(i18n, 'emit');

            // No error
            i18n._appType = 'streamhub-wall';
            i18n._handleTranslationsReceived(null, mockTranslationResponse);
            expect(i18n.emit.callCount).toEqual(2);

            // Has error
            i18n._handleTranslationsReceived({}, {});
            expect(i18n.emit.callCount).toEqual(3);
        });
    });

    describe('#hasChanged', function () {
        it('returns true if there have been changes since last call', function () {
            i18n._changed = true;
            expect(i18n.hasChanged()).toEqual(true);
            expect(i18n.hasChanged()).toEqual(false);
        });

        it('returns false if there have not been any changes', function () {
            expect(i18n.hasChanged()).toEqual(false);
        });
    });

    describe('#isEmpty', function () {
        it('returns `true` if no translations exist', function () {
            expect(i18n.isEmpty()).toEqual(true);
        });

        it('returns `false` if translations are set', function () {
            i18n._i18n['abc'] = 'def';
            expect(i18n.isEmpty()).toEqual(false);
        });
    });

    describe('#remove', function () {
        it('supports a string argument', function () {
            i18n._i18n['abc'] = 'def';
            i18n.remove('abc');
            expect('abc' in i18n._i18n).toEqual(false);
        });

        it('supports an array of strings argument', function () {
            i18n._i18n['abc'] = 'def';
            i18n._i18n['def'] = 'ghi';
            i18n.remove(['abc', 'def']);
            expect('abc' in i18n._i18n).toEqual(false);
            expect('def' in i18n._i18n).toEqual(false);
        });
    });

    describe('#set', function () {
        beforeEach(function () {
            spyOn(i18n, 'emit').andCallThrough();
        });

        it('supports key, value, opts arguments', function () {
            i18n.set('abc', 'def', {silent: true});
            expect(i18n._i18n['abc']).toEqual('def');
            expect(i18n.emit.callCount).toEqual(0);
        });

        it('supports object of pairs and opts arguments', function () {
            i18n.set({abc: 'def', def: 'ghi'}, {silent: true});
            expect(i18n._i18n['abc']).toEqual('def');
            expect(i18n._i18n['def']).toEqual('ghi');
            expect(i18n.emit.callCount).toEqual(0);
        });

        it('triggers an updated event if `opts.silent` is false', function () {
            // silent is false
            i18n.set({abc: 'def', def: 'ghi'}, {silent: false});
            expect(i18n.emit.callCount).toEqual(1);

            // silent is undefined
            i18n.set({abc: 'def', def: 'ghi'});
            expect(i18n.emit.callCount).toEqual(2);
        });

        it('does not trigger updated event if `opts.silent` is true', function () {
            i18n.set({abc: 'def', def: 'ghi'}, {silent: true});
            expect(i18n.emit.callCount).toEqual(0);
        });
    });

    describe('#_set', function () {
        it('sets translations on the i18n object', function () {
            expect(i18n._i18n).toEqual({});
            i18n._set({data: {foo: 'bar'}});
            expect(i18n._i18n).toEqual({foo: 'bar'});
        });

        it('fills in missing data if `opt_fillIn` is truthy', function () {
            i18n._i18n = {foo: 'bar', yup: 'nope'};
            i18n._set({data: {foo: 'baz', blah: 'gah'}, fillIn: true});
            expect(i18n.getAll()).toEqual({foo: 'bar', blah: 'gah', yup: 'nope'});
        });

        it('overrides existing data if `opt_fillIn` is falsy', function () {
            i18n._i18n = {foo: 'bar', yup: 'nope'};
            i18n._set({data: {foo: 'baz', blah: 'gah'}});
            expect(i18n.getAll()).toEqual({foo: 'baz', blah: 'gah', yup: 'nope'});
        });

        it('sets the _changed flag to true', function () {
            i18n._set({data: {foo: 'bar'}});
            expect(i18n.hasChanged()).toEqual(true);
        });

        it('triggers an event telling listeners there are updates', function () {
            var evtFired = false;
            i18n.on(i18n.EVENTS.UPDATED, function () {
                evtFired = true;
            });
            i18n._set({data: {foo: 'bar'}});
            expect(evtFired).toEqual(true);
        });

        it('does not trigger an event if nothing changed', function () {
            var evtFired = false;
            i18n._i18n = {foo: 'bar'};
            i18n.on(i18n.EVENTS.UPDATED, function () {
                evtFired = true;
            });
            i18n._set({data: {foo: 'bar'}});
            expect(evtFired).toEqual(false);
        });

        it('does not trigger an event if the silent option is `true`', function () {
            var evtFired = false;
            i18n.on(i18n.EVENTS.UPDATED, function () {
                evtFired = true;
            });
            i18n._set({data: {foo: 'bar'}, silent: true});
            expect(evtFired).toEqual(false);
        });
    });

    describe('#translate', function () {
        it('maps properties to default keys', function () {
            i18n.translate({data: {postButtonText: 'blah'}});
            expect(i18n.getAll()).toEqual({
                POST: 'blah',
                POST_PHOTO: 'blah'
            });
        });

        it('it uses a `map` if provided', function () {
            i18n.initialize({translationMap: {postButtonText: ['derp']}});
            i18n.translate({data: {postButtonText: 'blah'}});
            expect(i18n.getAll()).toEqual({derp: 'blah'});
        });

        it('merges the root data with translated data if `merge` option is passed', function () {
            i18n.initialize({translationMap: {postButtonText: ['derp']}});
            i18n.translate({
                data: {
                    postButtonText: 'blah',
                    moar: 'test'
                },
                merge: true
            });
            expect(i18n.getAll()).toEqual({
                derp: 'blah',
                moar: 'test'
            });
        });
    });
});
