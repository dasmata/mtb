"use strict";
var GridActivity = require("./GridActivity");
var Users = require("../collections/Users.js");
var UsersView = require("../views/UsersView");

/**
 * The users activity
 */
class UsersActivity extends GridActivity{
    /**
     * @constructor
     * @param {Backbone.Router} ctx - The application context
     */
    constructor(ctx){
        super(ctx);
        this.baseRoute = "users";
    }

    /**
     * @inheritdoc
     */
    getCollection(){
        return new Users();
    }

    /**
     * @inheritdoc
     */
    getView(){
        return new UsersView();
    }

    /**
     * @inheritdoc
     */
    getService(){
        return this.context.di.get("users.service");
    }
}

module.exports = UsersActivity;
