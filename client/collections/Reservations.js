"use strict";

var Reservation = require("../models/Reservation");

module.exports = Backbone.Collection.extend({
    model: Reservation,
    url: "/api/reservations"
});
