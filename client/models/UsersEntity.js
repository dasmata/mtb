"use strict";
var User = Backbone.Model.extend({
    "urlRoot": "/api/users",
    "idAttribute": "uuid",
    "toString": function () {
        return this.get("name");
    },
    "schema": {
        "username": {
            "type": "Text",
            "title": "Username",
            "validate": [
                "notEmpty"
            ]
        },
        "phone": {
            "type": "Text",
            "title": "Phone",
            "validate": [
                "notEmpty",
                "phone"
            ]
        },
        "email": {
            "type": "Text",
            "title": "Email",
            "validate": [
                "notEmpty",
                "email"
            ]
        }
    }
});

module.exports = User;
