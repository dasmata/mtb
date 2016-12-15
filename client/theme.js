"use strict";
window.app = window.app || {};

require("./Service/Security.js"); // do not remove this
var menu = null;
var userInfo = null;
var isAdmin = false;
var UserInfo = require("./header/UserInfo.js");
var Menu  = require("./header/Menu.js");

window.app.router = new (Backbone.Router.extend({
  "routes":{
    "*notfound": function(){}
  },
  "execute": function(){
    if(!userInfo){
      userInfo = new UserInfo();
    }
    if(!menu) {
      menu = new Menu();
    }
    if(/^\/admin*/.test(window.location.pathname)){
      isAdmin = true;
      $(document).trigger("navigate.admin", window.location.pathname);
    } else {
      $(document).one("navigate.user", function(e){
        if(isAdmin && !e.isDefaultPrevented()){
          window.location = window.location.pathname;
        }
        isAdmin = false;
      });
      $(document).trigger("navigate.user", window.location.pathname);
    }
  }
}))();

function initAdmin(event, path){
  $("#content").html("");
  $("#footer").html("");
  $("body").append($(document.createElement("script"))
    .attr("async", "true")
    .attr("src", "/admin/script.js"));
  $(document).off("navigate.admin", initAdmin);
}
$(document).on("navigate.admin", initAdmin);

Backbone.history.start({pushState: true});