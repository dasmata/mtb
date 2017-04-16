"use strict";

var SecurityService = require("./services/SecurityService");
var AclService = require("./services/AclService");
var TranslateService = require("./services/TranslateService");
var ReservationService = require("./services/ReservationsService");
var GridService = require("./services/GridService");

module.exports = [
    {
        name: "security",
        serviceConstructor: SecurityService
    },
    {
        name: "translate",
        serviceConstructor: TranslateService
    },
    {
        name: "acl",
        params: ["security"],
        serviceConstructor: AclService
    },
    {
        name: "reservations",
        params: ["security"],
        serviceConstructor: ReservationService
    },
    {
        name: "grid",
        params: ["security"],
        serviceConstructor: GridService
    }
];
