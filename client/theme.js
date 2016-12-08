"use strict";
import $ from "jquery";
import Security from "./Service/Security.js"; // do not remove this
import UserInfo from "./header/UserInfo.js";
import Menu from "./header/Menu.js";

window.$ = $;
window.jQuery = $;
window.app = window.app || {};
var menu = null;
var userInfo = null;
app.router = new (Backbone.Router.extend({
  "routes":{
    "*notfound": function(){}
  },
  "execute": function(){
    if(/^\/admin*/.test(window.location.pathname)){
      $(document).trigger("navigate.admin", window.location.pathname);
    } else {
      $(document).trigger("navigate.user", window.location.pathname);
    }
    if(!userInfo){
      userInfo = new UserInfo();
    }
    if(!menu) {
      menu = new Menu();
    }
  }
}))();

function initAdmin(event, path){
  $("body").append($(document.createElement("script"))
    .attr("async", "true")
    .attr("src", "/admin/script.js"));
  $(document).off("navigate.admin", initAdmin);
}
$(document).on("navigate.admin", initAdmin);

Backbone.history.start({pushState: true});