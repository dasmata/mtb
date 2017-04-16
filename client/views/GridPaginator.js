"use strict";

var Backgrid = require("backgrid");
require("backgrid-paginator");

var paginatorTemplate = require("../templates/grid-pagination.jade");

var GridPaginator = Backgrid.Extension.Paginator.extend({
    render(){
        var element, handles, ul, link;
        var totalPages = this.collection.state.totalPages;
        this.$el.html("");

        // Don't render if collection is empty
        if (this.renderMultiplePagesOnly && totalPages <= 1) {
            return this;
        }
        if (this.handles) {
            for (var j = 0, l = this.handles.length; j < l; j++) {
                this.handles[j].remove();
            }
        }
        element = $(paginatorTemplate());
        ul = element.find(".pagination");
        handles = this.handles = this.makeHandles();
        for (var i = 0; i < handles.length; i++) {
            link = handles[i].render().$el.addClass("page-item");
            link.find("a").addClass("page-link");
            ul.append(link);
        }
        this.$el.append(element);
        return this;
    }
});

module.exports = GridPaginator;
