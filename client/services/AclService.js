"use strict";

var Service = require("./Service");

/**
 * Middleware service that checks the user's access control list
 */
class AclService extends Service{

    /**
     * Handles the route
     *
     * @param {string} name The name of the route
     * @param {Promise} response The middleware response object
     * @returns {undefined}
     */
    handleRoute(name, response){
        return response.continue();
    }

}

module.exports = AclService;
