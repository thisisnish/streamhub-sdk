define([
    'streamhub-sdk/debug',
    'streamhub-sdk/jquery',
    'streamhub-sdk/util/date'
], function (debug, $, dateUtil) {
    'use strict';

    var log = debug('util');

    /**
     * A module containing utility methods.
     * @module streamhub-sdk/util
     */
    var exports = {};

    /**
     * Get outerWidth (jquery-style) of element
     * @deprecated
     */
    exports.outerWidth = function(el) {
        log('Deprecated: util.outerWidth');
        return $(el).outerWidth(true);
    };

    /**
     * Get outerHeight (jquery-style) of element
     * @deprecated
     */
    exports.outerHeight = function(el) {
        log('Deprecated: util.outerHeight');
        return $(el).outerHeight(true);
    };

    /**
     * Get innerWidth (jquery-style) of element
     * @deprecated
     */
    exports.innerWidth = function(el) {
        log('Deprecated: util.innerWidth');
        return $(el).innerWidth();
    };

    /**
     * Get innerHeight (jquery-style) of element
     * @deprecated
     */
    exports.innerHeight = function(el) {
        log('Deprecated: util.innerHeight');
        return $(el).innerHeight();
    };

    exports.formatDate = dateUtil.formatDate;

    /**
     * Binary search function.
     * Adapted from:
     * http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
     * @param {Array.<*>} arr - Array of character limits.
     * @param {function()} comparator - Comparison function.
     * @return {*?} Matched item.
     */
    exports.binarySearch = function (arr, comparator) {
        var minIndex = 0;
        var maxIndex = arr.length - 1;
        var currentIndex;
        var currentElement;
        var result;

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = arr[currentIndex];
            result = comparator(currentElement);

            if (result < 0) {
                minIndex = currentIndex + 1;
            } else if (result > 0) {
                maxIndex = currentIndex - 1;
            } else {
                return currentElement;
            }
        }
        return null;
    };

    /**
    * Simple wrapper for request animation frame or fallback.
    * @type {function}
    */
    exports.raf = (function () {
        if ('requestAnimationFrame' in window) {
            return window.requestAnimationFrame.bind(window);
        }
        return function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    exports.objectKeys = Object.keys || (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
            DontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            DontEnumsLength = DontEnums.length;

        return function (o) {
            if (typeof o !== "object" && typeof o !== "function" || o === null) {
                throw new TypeError("objectKeys called on a non-object");
            }

            var result = [];
            for (var name in o) {
                if (hasOwnProperty.call(o, name)) {
                    result.push(name);
                }
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < DontEnumsLength; i++) {
                    if (hasOwnProperty.call(o, DontEnums[i])) {
                        result.push(DontEnums[i]);
                    }
                }
            }

            return result;
        };
    })();

    Array.prototype.indexOf = Array.prototype.indexOf || function(val) {
        return $.inArray(val, this);
    };

    return exports;
});
