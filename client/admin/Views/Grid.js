"use strict";
import AbstractView from "./Abstarct";
import Backgrid from "backgrid";
import GridFormView from "./GridFormView";
import ActionsCell from "./ActionsCell";
import GridPaginator from "./GridPaginatorView";
import GridEntityService from "../Services/GridEntityService";


var template = require("../../templates/grid.jade");
var GridView = AbstractView.extend({
  "el": "#content",
  "gridTemplate": template,
  "events":{
    "click #add-btn": "createEntity",
    "change #grid-search": "search",
    "change #search-form": "search"
  },
  "serviceClass": GridEntityService,
  initialize(){
    this.collectionInstance = new this.collection();
    this.initGrid();
  },
  createEntity(e){
    this.formView = new GridFormView(this.entityName, this.serviceClass);
    this.listenToOnce(this.formView, "success", ()=>{
      this.collectionInstance.fetch();
    });
    this.showForm(this.formView, new this.model());
  },
  showForm(form, model){
    this.$(".container-fluid").hide();
    this.$el.append(form.render(model).$el.show());
    this.listenToOnce(form, "success", ()=>{
      this.$(".container-fluid").show();
    });
    this.listenToOnce(form, "cancel", ()=>{
      this.$(".container-fluid").show();
    });
  },
  initGrid(){
    this.columnsConfig = this.columns.slice(0);
    this.columnsConfig.push({
      "name": "",
      "label": "Actions",
      "editable": false,
      "cell": ActionsCell,
      "sortable": false
    });
    this.actionsCells = [];

    this.grid = new Backgrid.Grid({
      columns: this.columnsConfig,
      collection: this.collectionInstance
    });
    this.listenTo(this.grid.columns, "actions.cell", function(cell){
      this.actionsCells.push(cell);
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
    this.actionsCells.forEach((cell)=>{
      cell.remove();
    });
    this.$el.html("");
  },
  showGenericError(text){
    alert(text);
  }
});

export default GridView;