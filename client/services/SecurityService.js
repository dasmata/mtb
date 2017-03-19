"use strict";

var Service = require("./Service");
var User = require("../models/User");
var Identity = require("../models/Identity");
var SecurityError = require("../errors/Security");

/**
 * Class that handles user login/logout actions
 */
class SecurityService extends Service {

    /**
     * Returns the current authenticated user
     *
     * @returns {Promise} The promise that will pe resolved when the current identity is returned
     */
    getIdentity() {
        return new Promise((done, fail)=>{
            var model = new Identity();
            model.on("sync", function(model){
                done(model);
            });
            model.on("error", function(){
                fail(model);
            });
            model.fetch();
        });
    }

    /**
     * Authenticates a user and create an identity for that user
     *
     * @param {Object} credentials The credentials used for login
     * @returns {Promise} The promise that will be fulfilled once the identity is created
     */
    loginUser(credentials) {
        return new Promise((done, fail)=>{
            var model = new User(credentials);
            this.listenTo(model, "sync", ()=>{
                var identity = new Identity({
                    user: model,
                    token: model.token
                });
                delete model.token;
                this.stopListening(model);
                done(identity);
                identity.save();
            });
            this.listenTo(model, "error", ()=>{
                this.stopListening(model);
                fail(new SecurityError());
            });
            model.login();
        });
    }

    /**
     * Removes the identity of a user
     *
     * @returns {Promise} The promise that will be fulfilled once the identity is removed
     */
    logoutUser() {

    }

}

module.exports = SecurityService;
