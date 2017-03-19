"use strict";

var Service = require("./Service");

/**
 * Class that handles user login/logout actions
 */
class SecurityService extends Service{

    /**
     * Returns the current authenticated user
     *
     * @returns {Identity} The current user
     */
    getIdentity(){

    }

    /**
     * Authenticates a user and create an identity for that user
     *
     * @param {Object} credentials The credentials used for login
     * @returns {Promise} The promise that will be fulfilled once the identity is created
     */
    loginUser(credentials){

    }

    /**
     * Removes the identity of a user
     *
     * @returns {Promise} The promise that will be fulfilled once the identity is removed
     */
    logoutUser(){

    }

}

module.exports = SecurityService;
