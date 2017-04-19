"use strict";
var User = require("../models/UsersEntity.js");
var GridCollection = require("./GridCollection");

var Users = GridCollection.extend({
    model: User,
    url: "/api/users"
});

module.exports = Users;
