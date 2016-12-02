"use strict";

var User = Backbone.Model.extend({
    "urlRoot": function(){
        return "/users";
    },
    "idAttribute": "username",
    "login": function(){
        return this.save();
    }
});

export default User;