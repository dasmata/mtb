"use strict";
import User from "../Models/User";
import GridCollection from "./GridCollection";

var Users = GridCollection.extend({
  "url": "/api/users",
  "model": User
});


export default Users;
