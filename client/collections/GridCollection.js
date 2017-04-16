"use strict";
Backbone.PageableCollection = require("backbone.paginator");

module.exports = Backbone.PageableCollection.extend({
    queryParams: {
        currentPage: "page",
        pageSize: "count",
        sortKey: "sort",
        q: "",
        page: 0
    }
});
