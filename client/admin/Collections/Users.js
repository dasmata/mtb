"use strict";
import User from "../Models/User";

var Users = Backbone.Collection.extend({
  "url": "/api/users",
  "model": User
});


export default Users;
