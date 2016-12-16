"use strict";
import Backgrid from "backgrid";
import GridFormView from "./GridFormView";

var template = require("../../templates/grid-actions.jade");
var ActionsCell = Backgrid.Cell.extend({
  template: template,
  "events":{
    "click .delete": "deleteRow",
    "click .edit": "editRow"
  },
  initialize(grid){
    Backgrid.Cell.prototype.initialize.apply(this, arguments);
    grid.column.collection.trigger("actions.cell", this);
  },
  deleteRow(e) {
    if(confirm("Are you sure?")){
      var service = new this.context.serviceClass();
      service
          .setModel(this.model)
          .destroy()
          .catch(()=>{
            this.context.showGenericError("Could not delete");
          });
    }
  },
  editRow(e) {
    this.formView = new GridFormView(this.context.entityName, this.context.serviceClass);
    this.context.showForm(this.formView, this.model);
  },
  render() {
    this.$el.html(this.template());
    this.delegateEvents();
    return this;
  },
  setContext(ctx){
    this.context = ctx;
  }
});

export default ActionsCell;