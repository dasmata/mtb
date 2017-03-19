"use strict";
var User = Backbone.Model.extend({
    "urlRoot": function () {
        return "/api/users";
    },
    "idAttribute": "username",

    "login": function () {
        return this.save(null, {
            success: (model, response, options)=>{
                this.token = options.xhr.getResponseHeader("X-Access-Token");
            }
        });
    },
    "logout": function () {
        return this.destroy();
    },
    "register": function () {
        return this.save(this.attributes, {
            method: "post"
        });
    },
    "checkUsername": function () {
        return this.fetch({
            method: "get",
            url: this.urlRoot() + "/check/" + this.get("username")
        });
    }
});

module.exports = User;
