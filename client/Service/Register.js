"use strict";
import LoginService from "./Login";
import NotEmptyValidator from "../Validator/NotEmpty";
import PhoneValidator from "../Validator/Phone";
import UniqueUsernameValidator from "../Validator/UniqueUsername";
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
    return this.validate().then((valid)=>{
      if(valid){
        return this.processRegister()
          .then(()=>{
            return this.processLogin();
          }); //promise
      }
      return new Error();
    });
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
    var results = [];
    var fields = [];
    var validators = {
      "phone": [emptyValidator, phoneValidator],
      "username": [new UniqueUsernameValidator()]
    };
    Object.keys(validators).forEach((field)=>{
      validators[field].forEach((validator)=>{
        fields.push(field);
        results.push(validator.validate(this.credentials[field]));
      });
    });

    return Promise.all(results).then((results)=>{
      var validationResult = results.reduce((valid, currentValue, currentIndex)=>{
        if(!currentValue){
          this.registerError(fields[currentIndex], "");
        }
        return valid &= currentValue;
      }, valid);
      return validationResult;
    });
  }
}

export default RegisterService;
