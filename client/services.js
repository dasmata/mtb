"use strict";

var SecurityService = require("./services/SecurityService");
var AclService = require("./services/AclService");

module.exports = [
    {
        name: "security",
        serviceConstructor: SecurityService
    },
    {
        name: "acl",
        params: ["security"],
        serviceConstructor: AclService
    }
];
