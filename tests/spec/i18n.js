var i18n = require('streamhub-sdk/i18n');
var merge = require('mout/object/merge');

function setAppLevel(translations) {
    i18n._appLevelTranslations = translations;
    i18n._translations = merge(i18n._translationSet, i18n._appLevelTranslations);
}

describe('src/i18n.js', function () {
    var mockTranslationResponse = {
        code: 200,
        data: {
            translations: {
                'streamhub-wall': {
                    featuredText: 'def'
                }
            }
        }
    };

    var mockTranslationResponseWithDate = {
        code: 200,
        data: {
            translations: {
                'streamhub-wall': {
                    featuredText: 'def'
                },
                date: {
                    hoursAgo: '{number} hours ago'
                }
            }
        }
    };

    beforeEach(function () {
        i18n._appLevelTranslations = {};
        i18n._changed = false;
        i18n._translations = {};
        i18n._translationTransformMap = {};
        i18n._translationSet = {};
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
            i18n._translations = {abc: 'def'};
            expect(i18n.get('abc')).toEqual('def');
        });
    });

    describe('#getAll', function () {
        it('returns the translations', function () {
            i18n._translations = {abc: 'def'};
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

        it('merges the app-level translations over the received translations', function () {
            setAppLevel({featuredText: 'ghi'});
            i18n._appType = 'streamhub-wall';
            i18n._handleTranslationsReceived(null, mockTranslationResponse);
            expect(i18n.getAll()).toEqual({featuredText: 'ghi'});
        });

        it('does not translate if error', function () {
            spyOn(i18n, 'translate').andCallThrough();
            i18n._handleTranslationsReceived({}, {});
            expect(i18n.translate.callCount).toEqual(0);
        });

        it('does not fail if no `translations` object', function () {
            spyOn(i18n, 'translate').andCallThrough();
            i18n._handleTranslationsReceived(null, {code: 200, data: {}});
            expect(i18n.translate.callCount).toEqual(1);
        });

        it('overrides app specific translation data with date translations', function () {
            spyOn(i18n, 'translate').andCallThrough();
            i18n._appType = 'streamhub-wall';
            i18n._handleTranslationsReceived(null, mockTranslationResponseWithDate);
            expect(i18n.translate.callCount).toEqual(1);
            expect(i18n.getAll()).toEqual({
                featuredText: 'def',
                hoursAgo: '{number} hours ago'
            });
        });

        it('emits a received event', function () {
            spyOn(i18n, 'emit');

            // No error
            i18n._appType = 'streamhub-wall';
            i18n._handleTranslationsReceived(null, mockTranslationResponse);
            expect(i18n.emit.callCount).toEqual(1);

            // Has error
            i18n._handleTranslationsReceived({}, {});
            expect(i18n.emit.callCount).toEqual(2);
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
            i18n._translations['abc'] = 'def';
            expect(i18n.isEmpty()).toEqual(false);
        });
    });

    describe('#remove', function () {
        it('supports a string argument', function () {
            setAppLevel({abc: 'def'});
            i18n.remove('abc');
            expect('abc' in i18n._translations).toEqual(false);
        });

        it('supports an array of strings argument', function () {
            setAppLevel({abc: 'def', def: 'ghi'});
            i18n.remove(['abc', 'def']);
            expect('abc' in i18n._translations).toEqual(false);
            expect('def' in i18n._translations).toEqual(false);
        });
    });

    describe('#set', function () {
        beforeEach(function () {
            spyOn(i18n, 'emit').andCallThrough();
        });

        it('supports key, value, opts arguments', function () {
            i18n.set('abc', 'def', {silent: true});
            expect(i18n._appLevelTranslations['abc']).toEqual('def');
            expect(i18n._translations['abc']).toEqual('def');
            expect(i18n.emit.callCount).toEqual(0);
        });

        it('supports object of pairs and opts arguments', function () {
            i18n.set({abc: 'def', def: 'ghi'}, {silent: true});
            expect(i18n._appLevelTranslations['abc']).toEqual('def');
            expect(i18n._appLevelTranslations['def']).toEqual('ghi');
            expect(i18n._translations['abc']).toEqual('def');
            expect(i18n._translations['def']).toEqual('ghi');
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
            i18n._set({data: {foo: 'bar'}});
            expect(i18n._appLevelTranslations).toEqual({foo: 'bar'});
            expect(i18n._translations).toEqual({foo: 'bar'});
        });

        it('fills in missing data if `opt_fillIn` is truthy', function () {
            setAppLevel({foo: 'bar', yup: 'nope'});
            i18n._set({data: {foo: 'baz', blah: 'gah'}, fillIn: true});
            expect(i18n.getAll()).toEqual({foo: 'bar', blah: 'gah', yup: 'nope'});
        });

        it('overrides existing data if `opt_fillIn` is falsy', function () {
            setAppLevel({foo: 'bar', yup: 'nope'});
            i18n._set({data: {foo: 'baz', blah: 'gah'}});
            expect(i18n.getAll()).toEqual({foo: 'baz', blah: 'gah', yup: 'nope'});
        });

        it('sets the _changed flag to true', function () {
            i18n._set({data: {foo: 'bar'}});
            expect(i18n.hasChanged()).toEqual(true);
        });

        it('it can remove keys if set to `undefined`', function () {
            setAppLevel({abc: 'def'});
            i18n._set({data: {abc: undefined}});
            expect(i18n.getAll()).toEqual({});
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
            setAppLevel({foo: 'bar'});
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

        it('converts strings with `.` to objects', function () {
            i18n.initialize({translationMap: {editorErrorBody: ['ERRORS.BODY']}});
            i18n.translate({data: {editorErrorBody: 'blah'}});
            expect(i18n.getAll()).toEqual({ERRORS: {BODY: 'blah'}});
        });

        it('it skips setting the values and returns them if `skipSet` is passed', function () {
            spyOn(i18n, '_set').andCallThrough();
            i18n.initialize({translationMap: {abc: ['abc'], def: ['def']}});

            var result = i18n.translate({data: {abc: 'def'}});
            expect(result).toBe(true);
            expect(i18n._set.callCount).toEqual(1);

            result = i18n.translate({data: {def: 'ghi'}, skipSet: true});
            expect(result).toEqual({def: 'ghi'});
            expect(i18n._set.callCount).toEqual(1);
        });

        it('removes entries whose values are `undefined`', function () {
            setAppLevel({abc: 'def'});
            i18n.initialize({translationMap: {abc: ['abc'], def: ['def']}});
            i18n.translate({data: {abc: undefined}});
            expect(i18n.getAll()).toEqual({});
        });

        it('removes entries whose values are `null`', function () {
            setAppLevel({abc: 'def'});
            i18n.initialize({translationMap: {abc: ['abc'], def: ['def']}});
            i18n.translate({data: {abc: null}});
            expect(i18n.getAll()).toEqual({});
        });
    });
});
