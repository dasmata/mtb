"use strict";

var AbstractView = Backbone.View.extend({
  "initialize": function(){
    if(AbstractView.currentView !== null){
      AbstractView.currentView.remove();
    }
    AbstractView.currentView = this;
  }
});

AbstractView.currentView = null;

export default AbstractView;
