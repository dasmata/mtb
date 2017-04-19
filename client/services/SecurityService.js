"use strict";

let Service = require("./Service");
let User = require("../models/User");
let Identity = require("../models/Identity");
let SecurityError = require("../errors/Security");


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

    /**
     * Activates and user account
     *
     * @param {{}} passwords - The password and confirm password values
     * @param {string} activationKey - The activation key provided to the user via email
     * @returns {Promise} - The promise that will be fulfilled when the user's account is activated
     */
    activateAccount(passwords, activationKey){
        return new Promise((done, fail)=>{
            let model = new User();
            if(passwords.password !== passwords.confirm_password){
                fail(new Error("Parolele nu corespund"));
                return;
            }
            done(model.activateAccount(passwords.password, activationKey));
        });
    }
}

module.exports = SecurityService;
