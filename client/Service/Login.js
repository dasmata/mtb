"use strict";
import FormValidationError from "../Error/FormValidationError.js";
import Promise from "bluebird";
import User from "../Models/Users";
import $ from "jquery";
import NotEmptyValidator from "../Validator/NotEmpty";

var defaultCredentials = {
  "username": "",
  "password": ""
};

class Login {

  constructor() {
    this.errors = [];
  }

  login(credentials) {
    this.credentials = {};
    Object.assign(this.credentials, defaultCredentials, credentials);
    if (this.validate()) {
      return this.processLogin(); //promise
    }
    throw new Error();
  }

  logout() {
    var prm = new Promise(function (done, fail) {
      security.identity.once("sync", ()=> {
        security.identity.off();
        done(security.identity);
        $(document).trigger("logout", security.identity);
      });
      security.identity.once("error", (error)=> {
        security.identity.off();
        window.location.reload();
      });
      security.identity.logout();
    });
    return prm;
  }

  validate() {
    var valid = 1;
    var validator = new NotEmptyValidator();
    this.resetErrors();
    if (!(valid &= validator.validate(this.credentials.username))) {
      this.registerError("username", validator.getMessage());
    }
    if (!(valid &= validator.validate(this.credentials.password))) {
      this.registerError("password", validator.getMessage());
    }
    return valid;
  }

  getErrors() {
    return this.errors;
  }

  processLogin() {
    var model = new User(this.credentials);
    var prm = new Promise(function (done, fail) {
      model.once("sync", ()=> {
        model.off();
        done(model);
        $(document).trigger("authenticate", model);
      });
      model.once("error", (error)=> {
        model.off();
        fail(new Error("Invalid credentials"), model);
      });
      model.login();
    });
    return prm;
  }

  registerError(field, text) {
    this.errors.push(new FormValidationError(text, field));
  }

  resetErrors() {
    this.errors = [];
  }

}

export default Login;
