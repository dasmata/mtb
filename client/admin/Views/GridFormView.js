"use strict";
import AbstractView from "./Abstarct";

var formTemplate = require("../../templates/grid-form.jade");

var GridFormView = AbstractView.extend({
  formTemplate: formTemplate(),
  events: {
    "click .btn-primary": "submit"
  },
  initialize: function(entity, serviceClass){
    this.serviceClass = serviceClass;
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
    this.$el.on('hidden.bs.modal', ()=>{
      $(this).data('bs.modal', null);
      if(this.success){
        _this.trigger("success");
      } else {
        _this.trigger("cancel");
      }
      _this.remove();
    });
  },
  submit(){
    this.success = false;
    if(this.form.validate() === null){
      this.form.commit();
      this.getService().setModel(this.model).save(this.form.getValue())
        .then((e)=>{
          if(typeof e !== "undefined" && e instanceof Error){
            this.getService().getErrors().forEach((err)=>{
              this.form.fields[err.getFieldName()].setError(err.message);
            });
            return;
          }
          this.success = true;
          this.$el.modal("hide");
        });
    }
  },
  getService(){
    return this.service ? this.service : this.service = new this.serviceClass();
  }
});

export default GridFormView;