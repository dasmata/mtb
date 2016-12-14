"use strict";

import AbstractValidator from "./Abstract";
import User from "../Models/Users";

class UniqueUsername extends AbstractValidator {

  constructor(){
    super();
    this.message = "Acest nume de utilizator mai este folosit";
  }

  validate(value){
    return new Promise(function(done, fail){
      var model = new User({username: value});
      model.on("sync", ()=>{
        done(false); // it's correct. do not switch!
        model.off();
      });
      model.on("error", ()=>{
        done(true); // it's correct. do not switch!
        model.off();
      });
      model.checkUsername();
    });
  }

}

export default UniqueUsername;
