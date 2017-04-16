"use strict";

var Backgrid = require("backgrid");
var DistanceFormatter = require("./DistanceFormatter");

var privateFormatter = DistanceFormatter;
var precision = 100;

/**
 * Formats a distance by adding the unit of measure and summing the distances for the trips
 *
 * @constructor
 */
function TripsSumFormatter(){}

TripsSumFormatter.prototype.fromRaw = function(value){
    var sum;
    if(typeof value !== "object" || value === null || value.constructor !== Array){
        return "";
    }
    sum = value.reduce(function(currentSum, el){
        return currentSum += parseFloat(el.distance) * precision;
    }, 0);
    return privateFormatter.fromRaw(parseInt(sum) / precision);
};


module.exports = $.extend({}, Backgrid.CellFormatter.prototype, {
    "fromRaw" : TripsSumFormatter.prototype.fromRaw,
});
