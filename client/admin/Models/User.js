"use strict";
import FrontUser from "../../Models/Users";


var User = FrontUser.extend({
  "urlRoot": "/api/users",
  "idAttribute": "uuid",
  "schema": {
    "username": {
      type: "Text",
      validators: ['email']
    },
    "password": {
      type: "Password"
    },
    "phone": {
      type: "Text",
    }
  }
});

export default User;
