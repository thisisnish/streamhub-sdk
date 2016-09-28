var StreamhubShareButton = require('streamhub-share');

function ShareButton() {
    StreamhubShareButton.apply(this, arguments);

}
ShareButton.prototype = Object.create(StreamhubShareButton.prototype);
ShareButton.prototype.constructor = ShareButton;

ShareButton.prototype.template = function () {
    return this._label;
}

ShareButton.prototype.elClassPrefix = 'hub';
ShareButton.prototype.ariaLabel = 'Share';

module.exports = ShareButton
