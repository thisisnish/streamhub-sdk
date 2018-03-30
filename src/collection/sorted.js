var enums = require('streamhub-sdk/enums');
var EventEmitter = require('event-emitter');
var filter = require('mout/array/filter');
var find = require('mout/array/find');
var get = require('mout/object/get');
var inherits = require('inherits');
var util = require('streamhub-sdk/util');

function SortedCollection() {
    EventEmitter.apply(this, arguments);

    /**
     * Container for all content that comes in.
     * @type {Array.<Content>}
     */
    this.contents = [];

    /**
     * Whether the collection is media only.
     * @type {boolean}
     * @private
     */
    this._mediaOnly = false;

    /**
     * Sort order for the contents within this collection.
     * @type {string}
     * @private
     */
    this._order = getSortOrder(enums.SORT_ORDER.CREATED_AT_DESC);
}
inherits(SortedCollection, EventEmitter);

/**
 * Get the sort order value without `-` because this is always sorted in
 * descending order.
 * @param {string} order
 * @return {string}
 */
function getSortOrder(order) {
    return order.match(/-?(.*)/)[1];
}

/**
 * Filter attachments by media only. Means only photos and videos.
 * @param {Array.<object>} attachments
 * @return {Array.<object>}
 */
function filterMediaOnly(attachments) {
    return filter(attachments, function (oembed) {
        return ['video', 'photo'].indexOf(oembed.type) > -1;
    });
}

/**
 * Add the content to the list by createdAt order.
 * @param {Content} content Content to add.
 */
SortedCollection.prototype.add = function (content) {
    if (find(this.contents, {id: content.id})) {
        return;
    }
    if (this._mediaOnly && !filterMediaOnly(content.attachments).length) {
        return;
    }
    util.binaryInsert({
        array: this.contents,
        prop: 'meta.content.' + this._order,
        value: content
    });
    this.emit('added', content);
};

/**
 * Sets whether the sorted collection is media only or not.
 * @param {boolean} value
 */
SortedCollection.prototype.setMediaOnly = function (value) {
    this._mediaOnly = !!value;
};

/**
 * Update the sort order for the sorted collection. Re-sorts the content and
 * updates the order so that any new content is in the correct order.
 * @param {string} order New order.
 */
SortedCollection.prototype.setSortOrder = function (order) {
    if (!order || getSortOrder(order) === this._order) {
        return;
    }
    this._order = order = getSortOrder(order);
    this.contents.sort(function (a, b) {
        var orderA = get(a, 'meta.content.' + order);
        var orderB = get(b, 'meta.content.' + order);
        return -1 * (orderA - orderB);
    });
};

module.exports = SortedCollection;
