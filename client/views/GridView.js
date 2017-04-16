"use strict";
var Abstract = require("./Abstract");
var Backgrid = require("backgrid");
var GridPaginator = require("./GridPaginator");
var ActionsCell = require("./ActionsCell");
var tpl = require("../templates/grid.jade");

require("backgrid/lib/backgrid.css");

module.exports = Abstract.extend({
    "events": {
        "click #add-btn": "createEntity",
        "change #grid-search": "search",
        "change #search-form": "search"
    },

    /**
     * The Grid View
     * @constructor
     */
    initialize: function () {
        this.template = $(tpl({"entity": this.entityName}));

    },

    /**
     * Sets the value for the collection property and registers events on the new collection
     *
     * @param {GridCollection} collection The new collection used by the grid
     * @return {undefined}
     */
    setCollection: function (collection) {
        this.collection = collection;
        this.initGrid();
        this.listenTo(this.collection, "sync", _.bind(function () {
            this.$("#grid-holder").append(this.grid.render().el);
        }, this));
        this.listenTo(this.collection, "error", _.bind(function () {

        }, this));
    },

    /**
     * Creates an entity
     *
     * @param {Event} e The click event
     * @returns {undefined}
     */
    createEntity: function (e) {
        e.preventDefault();
        this.activity.createEntity();
    },

    /**
     * renders the grid template
     *
     * @returns {undefined}
     */
    render: function () {
        this.$el.append(this.template);
        this.$el.append(this.renderPagination());
        $("#content").append(this.$el);
        this.searchField = this.$("#grid-search");
    },

    /**
     * Renders the pagination section
     *
     * @returns {undefined}
     */
    renderPagination: function () {
        return this.paginator.render().el;
    },

    /**
     * Detaches the element
     *
     * @returns {undefined}
     */
    detach: function () {
        this.$el.detach();
    },

    /**
     * Initializes the grid
     *
     * @returns {undefined}
     */
    initGrid: function () {
        this.actionCells = [];
        this.columnsConfig.push({
            "name": "",
            "label": "Actions",
            "editable": false,
            "cell": ActionsCell,
            "sortable": false
        });

        this.grid = new Backgrid.Grid({
            columns: this.columnsConfig,
            collection: this.collection
        });
        this.listenTo(this.grid.columns, "actions.cell", _.bind(function (cell) {
            this.actionCells.push(cell);
            cell.setActivity(this.activity);
        }, this));
        this.grid.columns.at(this.grid.columns.length - 1).get("cell").entityName = this.entityName;

        this.paginator = new GridPaginator({
            collection: this.collection
        });
    },

    /**
     * Initiates the search
     *
     * @returns {undefined}
     */
    search: function () {
        this.activity.search(this.searchField.val());
    },

    remove: function () {
        this.paginator.remove();
        this.template.remove();
    }
});
