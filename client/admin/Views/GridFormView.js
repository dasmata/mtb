"use strict";
import AbstractView from "./Abstarct";

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
      this.model.save(this.form.getValue());
      this.$el.modal("hide");
    }
  }
});

export default GridFormView;