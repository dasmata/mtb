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
    },
    "role": {
      "type": "Select",
      "options": [
        {val: 3, label: "Client"},
        {val: 7, label: "Employee"},
        {val: 15, label: "Admin"}
      ]
    }
  }
});

export default User;
