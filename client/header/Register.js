"use strict";
import RegisterService from "../Service/Register.js";

var registerTemplate = require("../templates/register.jade");

var Register = Backbone.View.extend({
  "tagName": "div",
  "attributes" : {
    "id": "register"
  },
  "fields": null,
  "events": {
    "submit form": "processRegister"
  },
  "initialize": function(){
    this.fields = {};
    this.$el.append(registerTemplate());
    this.errorHolder = this.$(".error-holder");
    this.$(":input").each((k, input)=>{
      this.fields[input.name] = $(input);
    });
    this.render();
  },
  "processRegister": function(e){
    e.preventDefault();
    try{
      this.resetErrors();
      this.getService().register(this.value())
        .then((data)=>{
          if(data.constructor === error){
            return this.displayErrors(this.getService().getErrors());
          }
          this.remove();
        })
        .catch(()=>{
          this.displayErrors(this.getService().getErrors());
        });
    } catch (e){
      this.displayErrors(this.getService().getErrors());
    }
  },
  "getService": function(){
    return this.service ? this.service : this.service = new RegisterService();
  },
  "value": function(){
    var values = {};
    _.each(this.fields, (input, name)=>{
      values[name] = input.val();
    });
    return values;
  },
  "displayErrors": function(errors){
    errors.forEach((error)=>{
      this.fields[error.getFieldName()].addClass("error");
    });
  },
  "resetErrors": function(){
    this.$(".error").removeClass("error");
    this.errorHolder.text("").css("visibility", "hidden");
  },
  "displayServerError": function(text){
    this.errorHolder.text(text).css("visibility", "show");
  },
  "render": function(){
    if(!security.isAuth()){
      this.$el.show();
      return;
    }
    this.$el.hide();
  },
  "remove": function(){
    this.$el.detach();
  }
});


export default Register;