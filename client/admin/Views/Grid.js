"use strict";
import AbstractView from "./Abstarct";
import Backgrid from "backgrid";
import GridFormView from "./GridFormView";
import ActionsCell from "./ActionsCell";

var template = require("../../templates/grid.jade");
var GridView = AbstractView.extend({
  "el": "#content",
  "gridTemplate": template,
  "events":{
    "click #add-btn": "createEntity"
  },
  initialize(){
    this.collectionInstance = new this.collection();
    this.initGrid();
  },
  createEntity(){
    this.formView = new GridFormView(this.entityName);
    this.formView.render(new this.model());
    this.listenTo(this.formView, "success", ()=>{
      this.collectionInstance.fetch();
    });
  },
  initGrid(){
    this.columns.push({
      "name": "",
      "label": "Actions",
      "editable": false,
      "cell": ActionsCell
    });

    this.grid = new Backgrid.Grid({
      columns: this.columns,
      collection: this.collectionInstance
    });
    this.listenTo(this.grid.columns, "actions.cell", function(cell){
      cell.setContext(this);
    });
    this.grid.columns.at(this.grid.columns.length - 1).get("cell").entityName = this.entityName;
  },
  render(){
    this.$el.html(this.gridTemplate({
      "entity": this.entityName
    }));
    this.collectionInstance.fetch({reset: true});
    this.$("#grid-holder").append(this.grid.render().el);
  }
});

export default GridView;