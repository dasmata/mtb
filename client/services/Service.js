"use strict";

/**
 * Abstract service class
 *
 * @abstract
 */
class Service {

    /**
     * @constructor
     * @param {SecurityService} security - The security service
     */
    constructor(security) {
        this.securityService = security;
        Object.assign(this, Backbone.Events);
    }

    /**
     * Creates a promise that can later pe used to initiate a http request
     *
     * @param {Backbone.Model|Backbone.Collection} entity - The entity that will be used for the request
     * @returns {Promise} - The promise that cand later pe used to initate a HTTP request
     */
    getRequestPromise(entity) {
        return new Promise((done, fail) => {
            this.securityService.getIdentity().then((identity) => {
                if(!identity){
                    fail();
                }
                entity.sync = function(method, model, options){
                    options.headers = {"X-Acces-Token": identity.get("token")};
                    return Backbone.sync.call(this, method, model, options);
                };
                done();
            });
        });
    }
}

module.exports = Service;