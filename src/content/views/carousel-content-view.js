var findIndex = require('mout/array/findIndex');
var inherits = require('inherits');
var ModalContentCardView = require('streamhub-sdk/content/views/modal-content-card-view');
var template = require('hgn!streamhub-sdk/content/templates/carousel-content-view');
var View = require('view');

function CarouselContentView(opts) {
  View.call(this, opts);

  this.listView = this.opts.listView;
  this.collection = this.opts.collection;
  this.content = this.opts.content;
  this.createdAt = new Date(); // store construction time to use for ordering if this.content has no dates

  if (this.collection) {
    console.log('Contents of collection:', this.collection.contents);

    this.contentIdx = findIndex(this.collection.contents, {id: this.content.id});

    this.collection.on('added', function () {
      this.contentIdx = findIndex(this.collection.contents, {id: this.content.id});
    }.bind(this));
  }
}
inherits(CarouselContentView, View);

CarouselContentView.prototype.events = View.prototype.events.extended({
  'click .left': function () {
    if (!this.collection.contents[this.contentIdx - 1]) {
      return;
    }
    this.contentIdx--;
    var view = new ModalContentCardView({
      content: this.collection.contents[this.contentIdx],
      productOptions: this.opts.productOptions
    });
    view.render();
    this.$el.find('.content-container').html('').append(view.$el);    
    this.content = this.collection.contents[this.contentIdx];
  },
  'click .right': function () {
    if (!this.collection.contents[this.contentIdx + 1]) {
      return;
    }
    this.contentIdx++;
    var view = new ModalContentCardView({
      content: this.collection.contents[this.contentIdx],
      productOptions: this.opts.productOptions
    });
    view.render();
    this.$el.find('.content-container').html('').append(view.$el);    
    this.content = this.collection.contents[this.contentIdx];


    // TODO: Initial isn't set when content is retrieved.. so contents has all
    // content that has been fetched, but may not be shown. Need to handle this
    // differently.


    if (this.contentIdx - 1 === this.collection.contents.length) {
      this.listView && this.listView.$el.trigger('showMore.hub');
    }
  }
});

CarouselContentView.prototype.template = template;
CarouselContentView.prototype.elTag = 'div';
CarouselContentView.prototype.elClass = 'content-carousel';

CarouselContentView.prototype.render = function () {
  View.prototype.render.apply(this, arguments);

  var view = new ModalContentCardView({
    content: this.opts.content,
    productOptions: this.opts.productOptions
  });
  this.$el.find('.content-container').append(view.$el);
  view.render();

  return this;
};

module.exports = CarouselContentView;
