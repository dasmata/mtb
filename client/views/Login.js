"use strict";
var Abstract = require("./Abstract");
var LoginErrorView = require("./errors/Login");
var loginTpl = require("../templates/login.jade");

module.exports = Abstract.extend({
    events: {
        "submit form": "login"
    },
    initialize: function(){
        this.setElement(loginTpl());
        this.inputs = this.$("input.form-control");
        this.errorView = new LoginErrorView();
    },
    render: function(){
        return this;
    },
    login: function(e){
        var values = {};
        e.preventDefault();
        this.inputs.each(function(idx, field){
            values[field.name] = field.value;
        });
        this.getActivity().login(values);
    },
    displayLoginError: function(error){
        this.$("#loginForm").prepend(this.errorView.render(error).el);
    },
    hideLoginError: function(){
        this.errorView.detach();
    }
});
