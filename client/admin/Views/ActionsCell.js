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
      this.model.destroy();
    }
  },
  editRow(e) {
    this.formView = new GridFormView(this.context.entityName);
    this.formView.render(this.model);
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