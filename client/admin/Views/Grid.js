"use strict";
import AbstractView from "./Abstarct";
import Backgrid from "backgrid";
import GridFormView from "./GridFormView";
import ActionsCell from "./ActionsCell";
import GridPaginator from "./GridPaginatorView";

var template = require("../../templates/grid.jade");
var GridView = AbstractView.extend({
  "el": "#content",
  "gridTemplate": template,
  "events":{
    "click #add-btn": "createEntity",
    "change #grid-search": "search",
    "change #search-form": "search"
  },
  initialize(){
    this.collectionInstance = new this.collection();
    this.initGrid();
  },
  createEntity(e){
    this.formView = new GridFormView(this.entityName, this.serviceClass);
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
      "cell": ActionsCell,
      "sortable": false
    });

    this.grid = new Backgrid.Grid({
      columns: this.columns,
      collection: this.collectionInstance
    });
    this.listenTo(this.grid.columns, "actions.cell", function(cell){
      cell.setContext(this);
    });
    this.grid.columns.at(this.grid.columns.length - 1).get("cell").entityName = this.entityName;

    this.paginator = new GridPaginator({
      collection: this.collectionInstance
    });
  },
  render(){
    this.$el.html(this.gridTemplate({
      "entity": this.entityName
    }));
    this.searchField = this.$("#grid-search");
    this.collectionInstance.fetch({reset: true});
    this.$("#grid-holder").append(this.grid.render().el);
    this.$("#grid-holder").append(this.paginator.render().el);
  },
  search(){
    this.collectionInstance.queryParams.q = this.searchField.val();
    this.collectionInstance.fetch({reset: true});
  },
  remove(){
    this.stopListening();
    this.undelegateEvents();
    this.$el.html("");
  }
});

export default GridView;