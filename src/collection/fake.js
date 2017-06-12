var EventEmitter = require('event-emitter');
var inherits = require('inherits');
var find = require('mout/array/find');

function FakeCollection(opts) {
  opts = opts || {};
  this.contents = [];
  this.more = opts.more;
  EventEmitter.apply(this, arguments);
}
inherits(FakeCollection, EventEmitter);

FakeCollection.prototype.add = function (content) {
  var item = find(this.contents, {id: content.id});
  if (item) {
    return;
  }

  var idx = 0;
  for (var i = 0; i < this.contents.length; i++) {
    if (content.sortOrder > this.contents[i].sortOrder) {
      break;
    }
    if (content.sortOrder < this.contents[i].sortOrder) {
      idx++;
    }
  }

  this.contents.splice(idx, 0, content);
  this.emit('added', content);
};

module.exports = FakeCollection;
