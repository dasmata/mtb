"use strict";

var Service = require("./Service");
const ROLES = require("../roles");


/**
 * Middleware service that checks the user's access control list
 */
class AclService extends Service {

    /**
     * @constructor
     * @param {SecurityService} security The security service
     */
    constructor(security) {
        super();
        this.securityService = security;
    }

    /**
     * Handles the route
     *
     * @param {string} name The name of the route
     * @param {Promise} response The middleware response object
     * @param {Object} params Middleware paramters
     * @returns {undefined}
     */
    handleRoute(name, response, params) {
        if (typeof params === "undefined" || typeof params.allow === "undefined" || params.allow.length === 0) {
            return response.redirect("", {trigger: true});
        }
        return new Promise((done)=> {
            this.getRole().then((role)=> {
                var found = 0;
                params.allow.forEach(function(allow){
                    found = role & allow;
                    if(found > 0){
                        return false;
                    }
                });
                if (found) {
                    done(response.continue());
                } else {
                    done(response.redirect("login"));
                }
            });
        });

    }

    /**
     * Checks if the current user has the admin role
     *
     * @returns {Promise} The promise that will be fulfilled when the answer is available
     */
    isAdmin() {
        return this.hasRole(ROLES.ADMIN);
    }

    /**
     * Checks if the current identity user has a certain role
     *
     * @param {integer} role The role to check for
     * @returns {Promise} The promise that will be fulfilled when the answer is available
     */
    hasRole(role) {
        return this.getRole().then((identityRole)=> {
            return identityRole & role;
        });
    }

    /**
     * Returns the user's current role
     *
     * @returns {Promise} The promise that will be fulfilled when the answer is available
     */
    getRole() {
        return this.securityService.getIdentity().then((identity)=> {
            return identity ? identity.get("user").get("role") : ROLE.ANON;
        });
    }
}

module.exports = AclService;
