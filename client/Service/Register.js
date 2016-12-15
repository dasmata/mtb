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
      "username": ["notEmpty", "uniqueUsername"],
      "password": ["notEmpty"]
    });
  }

  setValidators(validators){
    this.validators = {
      "phone": [],
      "username": [],
      "password": []
    };
    Object.keys(validators).forEach((field, idx)=>{
      validators[field].forEach((name, index)=>{
        this.addValidator(field, name);
      })
    });
  }

  addValidator(field, name){
    this.validators[field].push(new validators[name]());
  }

  removeValidator(field, name){
    var tmp = [];
    this.validators[field].forEach((validator)=>{
      if(validator instanceof validators[name]){
        return true;
      }
      tmp.push(validator);
    });
    this.validators[field] = tmp;
  }

  save(data){
    return this.register(data);
  }

  register(data, autologin){
    this.credentials = {};
    Object.assign(this.credentials, defaultData, data);
    this.credentials.phone = phoneFormatter.fromRaw(this.credentials.phone);
    if(this.model && !this.model.isNew()){
      this.removeValidator("username", "uniqueUsername");
      this.removeValidator("password", "notEmpty");
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
    if(typeof this.credentials.password === "undefined" || this.credentials.password === null || this.credentials.password === ""){
      delete this.credentials.password;
      model.unset("password");
    }
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
    var valid = 1;
    var results = [];
    var fields = [];
    var validatorsIndex = [];
    Object.keys(this.validators).forEach((field)=>{
      this.validators[field].forEach((validator)=>{
        var validationResult;
        fields.push(field);
        validatorsIndex.push(validator);
        results.push(validator.validate(this.credentials[field]));
      });
    });
    var registeredErrorFileds = {};
    return Promise.all(results).then((results)=>{
      var validationResult = results.reduce((valid, currentValue, currentIndex)=>{
        if(!currentValue && !registeredErrorFileds[fields[currentIndex]]){
          this.registerError(fields[currentIndex], validatorsIndex[currentIndex].getMessage());
          registeredErrorFileds[fields[currentIndex]] = true;
        }
        return valid &= currentValue;
      }, valid);
      return validationResult;
    });
  }

  destroy(){
    return new Promise((done, fail)=>{
      var destroyCallback = ()=>{
        this.model.off("error", errorCallback);
        done();
      };
      var errorCallback = ()=>{
        this.model.off("destroy", destroyCallback);
        fail(new Error());
      };
      this.model.once("destroy", destroyCallback);
      this.model.once("error", errorCallback);
      this.model.destroy();
    });
  }
}

export default RegisterService;