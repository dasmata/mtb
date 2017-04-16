"use strict";
var moment = require("moment");
var Backgrid = require("backgrid");


module.exports = $.extend({}, Backgrid.CellFormatter.prototype, {
    "fromRaw": function (value) {
        var currentLocale = moment.locale(), result;
        moment.locale("ro");
        result = moment(value).format("ll");
        moment.locale(currentLocale);
        return result;
    },
});