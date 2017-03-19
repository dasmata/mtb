"use strict";
var LocalStorage = require("backbone.localstorage").LocalStorage;
var User = require("./User");

module.exports = Backbone.Model.extend({
    localStorage: new LocalStorage("security"),
    idAttribute: "token",
    parse: function(data){
        var obj = data[0] || {};
        obj.user = new User(obj.user || {role: 1});
        return obj;
    }
});
