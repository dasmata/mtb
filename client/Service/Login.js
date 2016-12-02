"use strict";

import FormValidationError from "../Error/FormValidationError.js";
import Promise from "bluebird";
import User from "../Models/Users";
import $ from "jquery";

var defaultCredentials = {
    "username": "",
    "password": ""
};

class Login{

    constructor(){
        this.errors = [];
    }

    login(credentials){
        this.credentials = {};
        Object.assign(this.credentials, defaultCredentials, credentials);
        if(this.validate()){
            return this.processLogin(); //promise
        }
        throw new Error();
    }

    validate(){
        var valid = 1;
        this.resetErrors();
        if(typeof this.credentials.username === "undefined" ||  this.credentials.username === null || this.credentials.username === ""){
            this.registerError("password", "The username field is mandatory");
            valid &= 0;
        }
        if(this.credentials.password === "undefined" ||  this.credentials.password === null || this.credentials.password === ""){
            this.registerError("password", "The password field is mandatory");
            valid &= 0;
        }
        return valid;
    }

    getErrors(){
        return this.errors;
    }

    processLogin(){
        var model = new User(this.credentials);
        var prm  = new Promise(function(done, fail){
            model.once("sync", ()=>{
                model.off();
                done(model);
                $(document).trigger("authenticate", model);
            });
            model.once("error", (error)=>{
                model.off();
                fail(new Error("Invalid credentials"), model);
            });
            model.login();
        });
        return prm;
    }

    registerError(field, text){
        this.errors.push(new FormValidationError(text, field));
    }

    resetErrors(){
        this.errors = [];
    }

}

export default Login;
