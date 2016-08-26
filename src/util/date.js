var $ = require('streamhub-sdk/jquery');
var i18n = require('streamhub-sdk/i18n');

'use strict';

/**
 * Abbreviated month strings.
 * @type {Array.<string>}
 */
var ABBREV_MONTH_STRINGS = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Month strings.
 * @type {Array.<string>}
 */
var MONTH_STRINGS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

/**
 * Format a date object to be displayed to humans
 * @param {Date} date - A JavaScript Date object.
 * @param {Date=} relativeTo - Optional JavaScript Date to compare `date` to.
 * @return {string} A formatted timestamp like "5/27//06 • 3:26 AM"
 */
function formatDate(date, relativeTo) {
    relativeTo = relativeTo || new Date();
    var diffMs = date.getTime() - relativeTo.getTime();
    
    // Future
    if (diffMs > 0) {
        return '';
    }
    // Just now (0s)
    if (diffMs > -1000) {
        return getDateTranslation(date, 'justNow', '1s');
    }
    // Less than 60s ago -> 5s
    if (diffMs > -60 * 1000) {
        return getDateTranslation(date, 'secondsAgo', '{number}s', {
            number: Math.round( -1 * diffMs / 1000)
        });
    }
    // Less than 1h ago -> 5m
    if (diffMs > -60 * 60 * 1000) {
        return getDateTranslation(date, 'minutesAgo', '{number}m', {
            number: Math.round( -1 * diffMs / (1000 * 60))
        });
    }
    // Less than 24h ago -> 5h
    if (diffMs > -60 * 60 * 24 * 1000) {
        return getDateTranslation(date, 'hoursAgo', '{number}h', {
            number: Math.round( -1 * diffMs / (1000 * 60 * 60))
        });
    }
    var formatKey = date.getFullYear() !== relativeTo.getFullYear() ?
        ['monthDayYearFormat', '{day} {monthAbbrev} {year}'] :
        ['monthDayFormat', '{day} {monthAbbrev}'];
    return getDateTranslation(date, formatKey[0], formatKey[1]);
}

/**
 * Get list of full or abbreviated month names.
 * @param {boolean=} opt_abbrev - Whether to get abbreviated names.
 * @return {Array.<string>}
 */
function getMonthNames(opt_abbrev) {
    var months = i18n.get(opt_abbrev ? 'monthNamesAbbrev' : 'monthNames');
    if (!months) {
        return opt_abbrev ? ABBREV_MONTH_STRINGS : MONTH_STRINGS;
    }
    return months = months.indexOf(', ') > -1 ?
        months.split(', ') :
        months.indexOf(',') > -1 ?
            months.split(',') :
            months;
}

/**
 * Gets a translation string from i18n (or uses the provided default) and does
 * string replacements with the provided `date` and any `opts` attributes that
 * are provided.
 * @param {Date} date - JavaScript date object.
 * @param {string} key - i18n translation key.
 * @param {string} defaultValue - Default value for the translation.
 * @param {Object=} opts - Optional additional translation attributes.
 * @return {string} Translated date string.
 */
function getDateTranslation(date, key, defaultValue, opts) {
    opts = opts || {};
    var str = i18n.get(key, defaultValue);

    // if the `number` attribute is in the `opts` object, check to see if it's
    // singular or not and get a new translation string for it.
    if ('number' in opts) {
        if (opts.number === 1) {
            str = i18n.get(key + 'Singular', defaultValue);
        }
    }

    // Loop through the attributes in the `opts` object and uses the key/value
    // pairs as replacements.
    $.each(opts, function (key, value) {
        str = str.replace('{' + key + '}', value);
    });

    var day = date.getDate();
    var month = date.getMonth();
    var monthNumber = month + 1;
    var year = date.getFullYear();

    // Replace all date strings on all translations so that customers have lots
    // of options.
    return str.replace('{day}', day)
        .replace('{dayFull}', day < 10 ? ('0' + day) : day)
        .replace('{month}', getMonthNames()[date.getMonth()])
        .replace('{monthAbbrev}', getMonthNames(true)[month])
        .replace('{monthNumber}', monthNumber)
        .replace('{monthNumberFull}', monthNumber < 10 ? ('0' + monthNumber) : monthNumber)
        .replace('{year}', year)
        .replace('{yearShort}', year.toString().slice(2));
}

module.exports = {
    formatDate: formatDate,
    getMonthNames: getMonthNames,
    getDateTranslation: getDateTranslation
};
