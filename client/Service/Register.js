"use strict";
import LoginService from "./Login";
import Promise from "bluebird";
import User from "../Models/Users";
import phoneFormatter from "../Formatter/RomaniaPhone";
import validators from "../Validator";

var defaultData = {
  "username": "",
  "password": "",
  "phone": ""
};

class RegisterService extends LoginService{

  constructor(){
    super();
    this.setValidators({
      "phone": ["notEmpty", "phone"],
      "username": ["notEmpty", "uniqueUsername"]
    });
  }

  setValidators(validators){
    this.validators = {
      "phone": [],
      "username": []
    };
    Object.keys(validators).forEach((field, idx)=>{
      validators[field].forEach((name, index)=>{
        this.addValidator(field, name);
      })
    });
  }

  addValidator(field, name){
    this.validators[field].push(validators[name]);
  }

  removeValidator(field, name){
    var tmp = [];
    this.validators[field].forEach((validator)=>{
      if(validator === validators[name]){
        return true;
      }
      tmp.push(validator);
    });
    this.validators[field] = tmp;
  }

  register(data, autologin){
    this.credentials = {};
    Object.assign(this.credentials, defaultData, data);
    this.credentials.phone = phoneFormatter.fromRaw(this.credentials.phone);
    if(this.model && !this.model.isNew()){
      this.removeValidator("username", "uniqueUsername");
    }

    return this.validate().then((valid)=>{
      if(valid){
        return this.processRegister()
          .then(()=>{
            if(autologin){
              return this.processLogin();
            }
          }); //promise
      }
      return new Error();
    });
  }

  setModel(model){
    this.model =  model;
    return this;
  }

  processRegister(){
    var model = this.model || new User();
    var prm;
    model.set(this.credentials);
    prm = new Promise((done, fail)=>{
      model.on("sync", (model)=>{
        model.off();
        done(model);
      });
      model.on("error", (model)=>{
        model.off();
        fail(new Error("Could not create user"), model);
      });
      if(!model.get("uuid")){
        model.register();
      } else {
        model.save();
      }

    });
    return prm;
  }

  validate(){
    var valid = super.validate();
    var results = [];
    var fields = [];
    var validatorsIndex = [];
    Object.keys(this.validators).forEach((field)=>{
      this.validators[field].forEach((validator)=>{
        fields.push(field);
        validatorsIndex.push(validator);
        results.push(validator.validate(this.credentials[field]));
      });
    });

    return Promise.all(results).then((results)=>{
      var validationResult = results.reduce((valid, currentValue, currentIndex)=>{
        if(!currentValue){
          this.registerError(fields[currentIndex], validatorsIndex[currentIndex].getMessage());
        }
        return valid &= currentValue;
      }, valid);
      return validationResult;
    });
  }
}

export default RegisterService;
