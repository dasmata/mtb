"use strict";
var Abstract = require("./Abstract");
var activateUserTpl = require("../templates/activate-user.jade");

module.exports = Abstract.extend({
    events: {
        "submit form": "activate"
    },

    initialize: function(){
        this.setElement(activateUserTpl());
        this.inputs = this.$("input.form-control");
    },
    render: function(){
        return this;
    },
    activate: function(e){
        var values = {};
        e.preventDefault();
        this.inputs.each(function(idx, field){
            values[field.name] = field.value;
        });
        this.getActivity().activate(values);
    }
});
