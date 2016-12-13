"use strict";
import User from "../Models/Users.js";

window.security = (function () {
  var identity = user !== null ? new User(user) : undefined;
  var service = {
    isAuth(){
      return typeof identity !== "undefined" && identity instanceof User;
    },

    get identity() {
      return identity;
    }
  };
  $(document).on("authenticate", function (e, model) {
    identity = model;
  });
  $(document).on("logout", function(e, model){
    identity = null;
  });
  service.constructor = function Security() {
  };
  return service;

})();
