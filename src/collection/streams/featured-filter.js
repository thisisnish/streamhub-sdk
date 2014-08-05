var inherits = require('inherits');
var Transform = require('stream/transform');

var FeaturedFilter = function (opts) {
    opts = opts || {};
    Transform.apply(this, arguments);
};
inherits(FeaturedFilter, Transform);

FeaturedFilter.prototype._transform = function (chunk, done) {
    console.log(chunk);
    debugger;
    this.push(chunk);
    done();
};

module.exports = FeaturedFilter;
