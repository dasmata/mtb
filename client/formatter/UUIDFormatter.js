"use strict";

var Backgrid = require("backgrid");

/**
 * Formats an UUID to a smaller string.
 *
 * @constructor
 */
function UUIDFormatter(){}

UUIDFormatter.prototype.fromRaw = function(value){
    return value.substr(0,4) + "..." + value.substr(value.length - 4, value.length);
};


module.exports = $.extend({}, Backgrid.CellFormatter.prototype, {
    "fromRaw" : UUIDFormatter.prototype.fromRaw,
});


