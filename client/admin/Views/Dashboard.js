"use strict";

var View = Backbone.View.extend({
  "el": "#content",
  "initialize": function(){

  },
  "render": function(){
    this.$el.html("");
  },
  remove(){
    this.stopListening();
    this.undelegateEvents();
    this.$el.html("");
  },
});

export default View;
