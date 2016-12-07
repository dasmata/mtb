"use strict";
import Backbone from "backbone";

var User = Backbone.Model.extend({
  "urlRoot": function () {
    return "/users";
  },
  "idAttribute": "username",
  "login": function () {
    return this.save();
  },
  "logout": function(){
    return this.destroy();
  }
});

export default User;