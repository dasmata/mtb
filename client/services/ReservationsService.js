"use strict";
var Abstract = require("./Service");
var Reservations = require("../collections/Reservations");
var Unauthorized = require("../errors/Unauthorized");

/**
 * The reservation service
 */
class ReservationsService extends Abstract {

    /**
     * @constructor
     * @param {SecurityService} security The security context of the app
     */
    constructor(security) {
        super(security);
    }

    /**
     * Gets the reservations for a given day
     *
     * @param {string} date Date formated as string in the YYYY-MM-DD format
     * @returns {Promise} The promise that will be fulfilled when the reservations are available
     */
    getReservations(date) {
        var collection = new Reservations();
        return this.getRequestPromise(collection).then(() => {
            return new Promise((done, fail) => {
                this.listenTo(collection, "sync", () => {
                    this.stopListening(collection);
                    done(collection);
                });
                this.listenTo(collection, "error", (collection, xhr) => {
                    var error = xhr.status === 401 ? new Unauthorized() : new Error();
                    this.stopListening(collection);
                    fail(error);
                });
                this.listenTo(collection, "add", (model) => {
                    this.trigger("add.reservation", model);
                });
                collection.fetch({
                    data: "date=" + date,
                });
            });
        }).catch(function(){});
    }

}

module.exports = ReservationsService;
