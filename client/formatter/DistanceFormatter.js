"use strict";

var Backgrid = require("backgrid");

/**
 * Formats a distance by adding the unit of measure
 *
 * @constructor
 */
function DistanceFormatter(){}

DistanceFormatter.prototype.fromRaw = function(value){
    return value + " km";
};


module.exports = $.extend({}, Backgrid.CellFormatter.prototype, {
    "fromRaw" : DistanceFormatter.prototype.fromRaw,
});
