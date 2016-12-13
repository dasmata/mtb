"use strict";

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
  },
  "checkUsername": function(){
    return this.fetch({
      method: "get",
      url: this.urlRoot() + "/check/" + this.get("username")
    });
  }
});

export default User;