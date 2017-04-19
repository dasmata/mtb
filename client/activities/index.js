"use strict";

var Auth = require("./Auth");
var Homepage = require("./Homepage");
var Dashboard = require("./Dashboard");
var Users = require("./Users");
var ActivateUser = require("./ActivateUser");

module.exports = {
    "Auth": Auth,
    "Homepage": Homepage,
    "Users": Users,
    "Dashboard": Dashboard,
    "ActivateUser": ActivateUser
};
