"use strict";

var loginTpl = require("../templates/login.jade");

module.exports = Backbone.View.extend({
    initialize: function(){
        this.setElement(loginTpl());
    },
    render: function(){
        return this;
    }
});
