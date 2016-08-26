'use strict';

var $ = require('jquery');
var i18n = require('streamhub-sdk/i18n');
var util = require('streamhub-sdk/util/date');

describe('streamhub-sdk/util/date', function () {
    var createdAt;
    var relativeTo;

    function addSeconds (numSeconds, relativeTo) {
        return new Date(relativeTo.getTime() + numSeconds * 1000);
    }
    function addMinutes (numMinutes, relativeTo) {
        return addSeconds(numMinutes * 60, relativeTo);
    }
    function addHours (numHours, relativeTo) {
        return addMinutes(numHours * 60, relativeTo);
    }
    function addDays (numDays, relativeTo) {
        return addHours(numDays * 24, relativeTo);
    }
    function addMonths (numMonths, relativeTo) {
        return addDays (numMonths * 31, relativeTo);
    }

    beforeEach(function () {
        // Thurs Aug 01 2013 00:01:01 GMT
        relativeTo = new Date();
        relativeTo.setFullYear(2013);
        relativeTo.setMonth(7);
        relativeTo.setDate(1);
        relativeTo.setHours(0);
        relativeTo.setMinutes(1);
        relativeTo.setSeconds(1);
    });

    describe('formatDate', function () {
        it('renders empty string if content is from the future', function () {
            createdAt = addSeconds(1, relativeTo);
            expect(util.formatDate(createdAt, relativeTo)).toBe('');
        });

        it('renders like 1s if content is from < 1s ago', function () {
            createdAt = relativeTo;
            expect(util.formatDate(createdAt, relativeTo)).toBe('1s');
        });

        it('renders like 1s if content is from 1s ago', function () {
            createdAt = addSeconds(-1, relativeTo);
            expect(util.formatDate(createdAt, relativeTo)).toBe('1s');
        });

        it('renders like 58s if content is from 58s ago', function () {
            createdAt = addSeconds(-58, relativeTo);
            expect(util.formatDate(createdAt, relativeTo)).toBe('58s');
        });

        it('renders like 1m if content is from 1:01m ago', function () {
            createdAt = addSeconds(-61, relativeTo);
            expect(util.formatDate(createdAt, relativeTo)).toBe('1m');
        });

        it('renders like 2m if content is from 1:31m ago', function () {
            createdAt = addMinutes(-1, addSeconds(-31, relativeTo));
            expect(util.formatDate(createdAt, relativeTo)).toBe('2m');
        });

        it('renders like 30m if content is from 30:05m ago', function () {
            createdAt = addMinutes(-30, addSeconds(-5, relativeTo));
            expect(util.formatDate(createdAt, relativeTo)).toBe('30m');
        });

        it('renders like 59m if content is from 59 minutes ago', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.formatDate(createdAt, relativeTo)).toBe('59m');
        });

        it('renders like 1h if content is from 1 hour ago', function () {
            createdAt = addHours(-1, relativeTo);
            expect(util.formatDate(createdAt, relativeTo)).toBe('1h');
        });

        it('renders like 2h if content is from 1h and 31m ago', function () {
            createdAt = addHours(-1, addMinutes(-31, relativeTo));
            expect(util.formatDate(createdAt, relativeTo)).toBe('2h');
        });

        it('renders like 21h if content is from 20h and 31m ago', function () {
            createdAt = addHours(-20, addMinutes(-31, relativeTo));
            expect(util.formatDate(createdAt, relativeTo)).toBe('21h');
        });

        it('renders like 21h if content is from 21h and 17m ago', function () {
            createdAt = addHours(-21, addMinutes(-17, relativeTo));
            expect(util.formatDate(createdAt, relativeTo)).toBe('21h');
        });

        it('renders like 23h if content is from 23h and 22m ago', function () {
            createdAt = addHours(-23, addMinutes(-22, relativeTo));
            expect(util.formatDate(createdAt, relativeTo)).toBe('23h');
        });
        // The following tests may fail on clients with different time zones
        it('renders like 24h if content is from 23h and 58m ago', function () {
            createdAt = addHours(-23, addMinutes(-58, relativeTo));
            expect(util.formatDate(createdAt, relativeTo)).toBe('24h');
        });

        it('renders like Jul 6 if content is from 1d and 29m ago', function () {
            createdAt = addHours(-24, addMinutes(-29, relativeTo));
            expect(util.formatDate(createdAt, relativeTo)).toBe('30 Jul');
        });

        it('renders like Dec 28 2012 if content is from < 1 year ago but a different year', function () {
            createdAt = addDays(-220, relativeTo);
            // The exact day will be different depending on the clients' timezone. So just check that the
            // month and year are there
            expect(util.formatDate(createdAt, relativeTo).indexOf('Dec 2012')).not.toBe(-1);
        });

        describe('supports translations', function () {
            beforeEach(function () {
                i18n.set('justNow', 'just now');
                i18n.set('secondsAgo', 'from {number} seconds ago');
                i18n.set('secondsAgoSingular', 'from {number} second ago');
                i18n.set('minutesAgo', 'from {number} minutes ago');
                i18n.set('minutesAgoSingular', 'from {number} minute ago');
                i18n.set('hoursAgo', 'from {number} hours ago');
                i18n.set('hoursAgoSingular', 'from {number} hour ago');
                i18n.set('monthDayFormat', 'month {monthAbbrev} and day {day}');
                i18n.set('monthDayYearFormat', 'month {monthAbbrev} and day {day} and year {year}');
            });

            afterEach(function () {
                i18n.reset();
            });

            it('< 1s ago', function () {
                createdAt = relativeTo;
                expect(util.formatDate(createdAt, relativeTo)).toBe('just now');
            });

            it('1s ago', function () {
                createdAt = addSeconds(-1, relativeTo);
                expect(util.formatDate(createdAt, relativeTo)).toBe('from 1 second ago');
            });

            it('58s ago', function () {
                createdAt = addSeconds(-58, relativeTo);
                expect(util.formatDate(createdAt, relativeTo)).toBe('from 58 seconds ago');
            });

            it('1m ago', function () {
                createdAt = addMinutes(-1, relativeTo);
                expect(util.formatDate(createdAt, relativeTo)).toBe('from 1 minute ago');
            });

            it('30m ago', function () {
                createdAt = addMinutes(-30, relativeTo);
                expect(util.formatDate(createdAt, relativeTo)).toBe('from 30 minutes ago');
            });

            it('1 hour ago', function () {
                createdAt = addHours(-1, relativeTo);
                expect(util.formatDate(createdAt, relativeTo)).toBe('from 1 hour ago');
            });

            it('4 hours ago', function () {
                createdAt = addHours(-4, relativeTo);
                expect(util.formatDate(createdAt, relativeTo)).toBe('from 4 hours ago');
            });

            it('1d and 29m ago', function () {
                createdAt = addHours(-24, addMinutes(-29, relativeTo));
                expect(util.formatDate(createdAt, relativeTo)).toBe('month Jul and day 30');
            });

            it('renders like Dec 28 2012 if content is from < 1 year ago but a different year', function () {
                createdAt = addDays(-220, relativeTo);
                // The exact day will be different depending on the clients' timezone. So just check that the
                // month and year are there
                expect(util.formatDate(createdAt, relativeTo)).toMatch(/month Dec and day \d{2} and year 2012/);
            });

            it('can do MM/DD/YYYY', function () {
                i18n.set('monthDayYearFormat', '{monthNumber}/{day}/{year}');
                createdAt = addDays(-220, relativeTo);
                expect(util.formatDate(createdAt, relativeTo)).toMatch(/12\/\d{2}\/2012/);
            })

            it('works with mix-and-match month/day/year values within any strings', function () {
                i18n.set('minutesAgo', '{number} minutes ago on {day}.{monthAbbrev}.{year}');
                createdAt = addMinutes(-30, relativeTo);
                expect(util.formatDate(createdAt, relativeTo)).toBe('30 minutes ago on 31.Jul.2013');
            });

            it('supports custom month values', function () {
                i18n.set('monthDayFormat', 'month {month} and day {day}');
                i18n.set('monthNames', 'gennaio, febbraio, marzo, aprile, maggio, giugno, luglio, agosto, settembre, ottobre, novembre, dicembre');
                createdAt = addMonths(-2, addHours(-24, addMinutes(-29, relativeTo)));
                expect(util.formatDate(createdAt, relativeTo)).toBe('month maggio and day 29');
            });

            it('supports custom abbreviated month values', function () {
                i18n.set('monthDayFormat', 'month {monthAbbrev} and day {day}');
                i18n.set('monthNamesAbbrev', 'genn, febbr, mar, apr, magg, giugno, luglio, ag, sett, ott, nov, dic');
                createdAt = addMonths(-2, addHours(-24, addMinutes(-29, relativeTo)));
                expect(util.formatDate(createdAt, relativeTo)).toBe('month magg and day 29');
            });
        });
    });

    describe('#getMonthNames', function () {
        it('uses default month strings by default', function () {
            expect(util.getMonthNames()).toEqual([
                'January', 'February', 'March', 'April',
                'May', 'June','July', 'August',
                'September', 'October', 'November', 'December'
            ]);
        });

        it('uses i18n month strings when available', function () {
            i18n.set('monthNames', 'gennaio, febbraio, marzo, aprile, maggio, giugno, luglio, agosto, settembre, ottobre, novembre, dicembre');
            expect(util.getMonthNames()).toEqual([
                'gennaio', 'febbraio', 'marzo', 'aprile',
                'maggio', 'giugno', 'luglio', 'agosto',
                'settembre', 'ottobre', 'novembre', 'dicembre'
            ]);
        });

        it('supports "," and ", " separators', function () {
            i18n.set('monthNames', 'gennaio, febbraio, marzo, aprile, maggio, giugno, luglio, agosto, settembre, ottobre, novembre, dicembre');
            expect(util.getMonthNames()).toEqual([
                'gennaio', 'febbraio', 'marzo', 'aprile',
                'maggio', 'giugno', 'luglio', 'agosto',
                'settembre', 'ottobre', 'novembre', 'dicembre'
            ]);

            i18n.set('monthNames', 'gennaio,febbraio,marzo,aprile,maggio,giugno,luglio,agosto,settembre,ottobre,novembre,dicembre');
            expect(util.getMonthNames()).toEqual([
                'gennaio', 'febbraio', 'marzo', 'aprile',
                'maggio', 'giugno', 'luglio', 'agosto',
                'settembre', 'ottobre', 'novembre', 'dicembre'
            ]);
        });

        it('supports abbreviated month names', function () {
            i18n.set('monthNamesAbbrev', 'genn, febbr, mar, apr, magg, giugno, luglio, ag, sett, ott, nov, dic');
            expect(util.getMonthNames(true)).toEqual([
                'genn', 'febbr', 'mar', 'apr',
                'magg', 'giugno', 'luglio', 'ag',
                'sett', 'ott', 'nov', 'dic'
            ]);
        });
    });

    describe('#getDateTranslation', function () {
        beforeEach(function () {
            i18n.reset();
        });

        it('handles singular numbers', function () {
            spyOn(i18n, 'get').andCallThrough();
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {number}', {
                number: 1
            })).toBe('test 1');
            expect(i18n.get.calls[1].args[0]).toBe('minutesAgoSingular');
        });

        it('replaces string with any options', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {number} {abc}', {
                abc: 'def',
                number: 1
            })).toBe('test 1 def');
        });

        it('replaces {day} string', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {day}')).toBe('test 31');
        });

        it('replaces {dayFull} string', function () {
            createdAt = addDays(-28, addMinutes(-59, relativeTo));
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {dayFull}')).toBe('test 03');
        });

        it('replaces {month} string', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {month}')).toBe('test July');
        });

        it('replaces {monthAbbrev} string', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {monthAbbrev}')).toBe('test Jul');
        });

        it('replaces {monthNumber} string', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {monthNumber}')).toBe('test 7');
        });

        it('replaces {monthNumberFull} string', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {monthNumberFull}')).toBe('test 07');
        });

        it('replaces {year} string', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {year}')).toBe('test 2013');
        });

        it('replaces {yearShort} string', function () {
            createdAt = addMinutes(-59, relativeTo);
            expect(util.getDateTranslation(createdAt, 'minutesAgo', 'test {yearShort}')).toBe('test 13');
        });
    });
});
