"use strict";
import LoginService from "./Login";
import NotEmptyValidator from "../Validator/NotEmpty";
import PhoneValidator from "../Validator/Phone";
import Promise from "bluebird";
import User from "../Models/Users";
import PhoneFormatter from "../Formatter/RomaniaPhone";

var defaultData = {
  "username": "",
  "password": "",
  "phone": ""
};

class RegisterService extends LoginService{

  register(data){
    this.credentials = {};
    Object.assign(this.credentials, defaultData, data);
    this.credentials.phone = (new PhoneFormatter()).format(this.credentials.phone);
    if (this.validate()) {
      return this.processRegister()
        .then(()=>{
          return this.processLogin();
        }); //promise
    }
    throw new Error();
  }

  processRegister(){
    var model = new User(this.credentials);
    var prm = new Promise((done, fail)=>{
      model.on("sync", (model)=>{
        model.off();
        done(model);
      });
      model.on("error", (model)=>{
        model.off();
        fail(new Error("Could not create user"), model);
      });
      model.register();
    });
    return prm;
  }

  validate(){
    var emptyValidator = new NotEmptyValidator();
    var phoneValidator = new PhoneValidator();
    var valid = super.validate();
    if(!(valid &= emptyValidator.validate(this.credentials.phone))){
      this.registerError("phone", emptyValidator.getMessage());
    } else if(!(valid &= phoneValidator.validate(this.credentials.phone))){
      this.registerError("phone", phoneValidator.getMessage());
    }
    return valid;
  }
}

export default RegisterService;
