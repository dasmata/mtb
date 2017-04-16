"use strict";

var NotEmptyValidator = require("./NotEmpty");
var PhoneValidator = require("./Phone");
var Float = require("./Float");
var Int = require("./Int");
var Between = require("./Between");
var Length = require("./Length");

module.exports = {
    "notEmpty": NotEmptyValidator,
    "phone": PhoneValidator,
    "float": Float,
    "int": Int,
    "between": Between,
    "length": Length
};