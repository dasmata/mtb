"use strict";
import Backbone from "backbone";
import $ from "jquery";
import _ from "underscore";
import LoginService from "../Service/Login.js";

var Login = Backbone.View.extend({
    "el" : "#login",
    "fields": null,
    "events": {
        "submit form": "processLogin"
    },
    "initialize": function(){
        this.fields = {};
        this.errorHolder = this.$(".error-holder");
        this.$(":input").each((k, input)=>{
            this.fields[input.name] = $(input);
        });
    },
    "processLogin": function(e){
        e.preventDefault();
        try{
            this.resetErrors();
            this.getService().login(this.value())
                .then(()=>{
                    this.remove();
                })
                .catch(()=>{
                    this.displayCredentialsError();
                });
        } catch (e){
            this.displayErrors(this.getService().getErrors());
        }
    },
    "getService": function(){
        return this.service ? this.service : this.service = new LoginService();
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
    "displayCredentialsError": function(){
        this.errorHolder.text("Invalid credentials").css("visibility", "show");
    }
});


export default Login;