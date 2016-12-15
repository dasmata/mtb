"use strict";

class Controller{

  constructor(){
    this.registerActions();
  }

  cleanup(){
    if(this.view){
      this.view.remove();
    }
  }

  registerActions(){
    var routeNames = Object.keys(this.actions);
    for(var i = 0, len = routeNames.length; i < len; i++){
      ((idx)=>{
        app.router.on("route:" + routeNames[idx], ()=>{
          $(document).trigger("change.page", this);
          this[this.actions[routeNames[idx]] + "Action"]();
        });
      })(i);
    }
  }
}

export default Controller;
