"use strict";

import Promise from "bluebird";
import validatorObjects from "../../Validator";

class GridEntityService {

  constructor() {
    this.validators = {};
    Object.assign(this, Backbone.Events);
  }

  setModel(model) {
    this.model = model;
    this.setValidators(model.schema);
    return this;
  }

  getErrors() {
    return this.errors;
  }

  save(data){
    return this.validate(data).then((valid)=>{
      if(valid){
        return this.processData(data);
      }
      return new Error();
    }).catch(function(){
      console.log(arguments);
    });
  }

  processData(data){
    var prm;
    this.model.set(data);
    prm = new Promise((done, fail)=>{
      var syncCallback = (model)=>{
        model.off("error", errorCallback);
        done(model);
      };
      var errorCallback = (model)=>{
        model.off("sync", syncCallback);
        fail(new Error("Could not create user"), model);
      };
      this.model.once("sync", syncCallback);
      this.model.once("error", errorCallback);
      this.model.save();
    });
    return prm;
  }

  setValidators(schema) {
    this.validators = {};
    Object.keys(schema).forEach((field, idx)=> {
      var validators = schema[field].validate;
      this.validators[field] = [];
      if(typeof validators !== "object" || validators.constructor !== Array){
        return true;
      }
      validators.forEach((validator)=>{
        var name = typeof validator === "string" ? validator : validator.name;
        var params = typeof validator === "string" ? {} : (validator.params || {});
        if(validatorObjects[name]){
          this.validators[field].push(new validatorObjects[name](params));
        } else {
          console.warn("Unknown validator " + name + ". Available validators are: " + Object.keys(validatorObjects).join(", "));
        }
      });
    });
  }

  validate(data){
    var valid = 1;
    var results = [];
    var fields = [];
    var validatorsIndex = [];
    Object.keys(this.validators).forEach((field)=>{
      this.validators[field].forEach((validator)=>{
        fields.push(field);
        validatorsIndex.push(validator);
        results.push(validator.validate(data[field]));
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

export default GridEntityService;