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
  },
  "register": function(){
    return this.save(this.attributes, {
      method: "post"
    });
  }
});

export default User;