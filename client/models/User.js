"use strict";
var User = Backbone.Model.extend({
    "urlRoot": "/auth/users",
    "idAttribute": "username",

    /**
     * Creates a http request to authenticate the user
     *
     * @returns {Promise} - The promise that will be fulfilled when the user is authenticated
     */
    "login": function () {
        return this.save(null, {
            success: (model, response, options) => {
                this.token = options.xhr.getResponseHeader("X-Access-Token");
            }
        });
    },
    /**
     * Creates a delete http request that logs out the user. The call actually deletes the access token
     *
     * @returns {Promise} - The promise that will be fulfilled when the call is completed
     */
    "logout": function () {
        return this.destroy();
    },
    /**
     * Creates a http POST request that authenticates the user
     *
     * @returns {Promise} - The promise that will be fulfilled when the call is completed
     */
    "register": function () {
        return this.save(this.attributes, {
            method: "post"
        });
    },
    /**
     * Creates A http GET request that checks the existance of the username.
     * If the response is a 404 HTTP STATUS code, the user does not exist.
     *
     * @returns {Promise} - The promise that will be fulfilled when the call is completed
     */
    "checkUsername": function () {
        return this.fetch({
            method: "get",
            url: this.urlRoot + "/check/" + this.get("username")
        });
    },
    /**
     * Creates a HTTP PUT requestr that activates a user by setting it's password
     *
     * @param {string} password - The user's password
     * @param {string} activationKey - A uuid V4 that represents the activation key received by the user via email
     * @returns {Promise} - The promise that will be fulfilled when the call is completed
     */
    "activateAccount": function(password, activationKey){
        let data = { password: password, activation_key: activationKey };
        return this.save(this.attributes, {
            method: "put",
            data: Object.keys(data).reduce(function(queryString, el){
                if(data[el] !== "" && data[el] !== null && typeof data[el] !== "undefined"){
                    queryString += "&" + el + "=" + data[el];
                }
                return queryString;
            }, "").substring(1)
        });
    },
    /**
     * Converts the current object tu o string
     *
     * @returns {string} - The username of the user
     */
    "toString": function () {
        return this.get("username");
    }
});

module.exports = User;
