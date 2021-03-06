"use strict";

var User = Backbone.Model.extend({
  "urlRoot": "/api/users",
  "idAttribute": "uuid",
  "schema": {
    "username": {
      type: "Text",
      validators: ['required', 'email']
    },
    "password": {
      type: "Password",
      validators: ['required']
    },
    "phone": {
      type: "Text",
      validators: ['required']
    }
  }
});

export default User;
