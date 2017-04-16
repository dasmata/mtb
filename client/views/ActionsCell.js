"use strict";
var Backgrid = require("backgrid");

var template = require("../templates/grid-actions.jade");

var ActionsCell = Backgrid.Cell.extend({
    template: template,
    "events": {
        "click .delete": "deleteRow",
        "click .edit": "editRow"
    },
    initialize(grid){
        Backgrid.Cell.prototype.initialize.apply(this, arguments);
        grid.column.collection.trigger("actions.cell", this);
    },
    deleteRow(e) {
        e.preventDefault();
        if (confirm("Are you sure?")) {
            this.activity.removeEntity(this.model)
                .catch(_.bind(function(){
                }, this));
        }
    },
    editRow(e){
        e.preventDefault();
        this.activity.editEntity(this.model);
    },
    render() {
        this.$el.html(this.template());
        this.delegateEvents();
        return this;
    },
    setActivity(act){
        this.activity = act;
    },
    remove(){
        this.stopListening();
        this.undelegateEvents();
        this.$el.remove();
    }
});

module.exports = ActionsCell;
