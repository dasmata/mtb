"use strict";
var AbstractView = require("../Abstract");

module.exports = AbstractView.extend({

    render: function(error){
        this.$el.addClass("error").text(error.message);
        return this;
    }

});