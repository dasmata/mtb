"use strict";
import AbstractView from "./Abstarct";
import RegisterService from "../../Service/Register";

var formTemplate = require("../../templates/grid-form.jade");

var GridFormView = AbstractView.extend({
  formTemplate: formTemplate(),
  events: {
    "click .btn-primary": "submit"
  },
  initialize: function(entity){
    this.setElement(formTemplate({
      entity: entity
    }));
  },
  render(model){
    var _this = this;
    this.model = model;
    this.form = new Backbone.Form({
      model: model
    }).render();
    this.$(".modal-body").append(this.form.el);
    this.$el.modal();
    this.$el.on('hidden.bs.modal', function () {
      $(this).data('bs.modal', null);
      _this.remove();
    });
  },
  submit(){
    if(this.form.validate()){
      this.form.commit();
      this.getService().setModel(this.model).register(this.form.getValue())
        .then(()=>{
          this.$el.modal("hide");
        });
    }
  },
  "getService": function(){
    return this.service ? this.service : this.service = new RegisterService();
  },
});

export default GridFormView;