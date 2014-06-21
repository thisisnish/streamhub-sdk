var inherits = require('inherits');
var View = require('view');
var template = require('hgn!streamhub-sdk/content/templates/content-error');

'use strict';

var ContentErrorView = function (opts) {
    opts = opts || {};

    this._error = opts.error;
    this._retry = opts.retry;

    View.call(this, opts);
};
inherits(ContentErrorView, View);

ContentErrorView.prototype.elClass = 'content-error';
ContentErrorView.prototype.retryLinkClass = 'content-retry-link';
ContentErrorView.prototype.template = template;

ContentErrorView.prototype.events = View.prototype.events.extended({
    'click': function (e) {
        e.stopPropagation();
        if ($(e.target).hasClass(this.retryLinkClass)) {
            this._retry();
        }
    }
});

ContentErrorView.prototype.setError = function (opts) {
    opts = opts || {};
    if (typeof opts.error === 'object') {
        this._error = opts.error.body.msg;
    } else {
        this._error = opts.error;
    }

    if (opts.error.body.error_type !== 'DuplicateCommentError') {
        this._retry = opts.retry;
    }
};

ContentErrorView.prototype.getTemplateContext = function () {
    var context = View.prototype.getTemplateContext.call(this);
    context.error = this._error;
    context.retry = !!this._retry;
    return context;
};

module.exports = ContentErrorView;
