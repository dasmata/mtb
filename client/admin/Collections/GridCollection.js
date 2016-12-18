"use strict";

Backbone.PageableCollection = require("backbone.paginator");

var GridCollection = Backbone.PageableCollection.extend({
  "state": {
    firstPage: 0,
    pageSize: 25
  },
  "queryParams": {
    currentPage: "page",
    pageSize: "count",
    sortKey: "sort",
    q: ""
  },
  "parse": function(data, obj){
    var rangesHeader = obj.xhr.getResponseHeader("Content-Range");
    if(!rangesHeader){
      return data;
    }
    var ranges = rangesHeader.replace("items ", "").split("/");
    var limits = ranges[0].split("-");
    this.state.totalRecords = parseInt(ranges[1], 10);
    this.state.totalPages = Math.ceil(ranges[1] / this.state.pageSize);
    this.state.lastPage = this.state.totalPages - 1;
    return data;
  },
  "sync": function(action, child, requestObject){
    if(typeof requestObject.data.sort !== "undefined" && requestObject.data.sort !== null && requestObject.data.sort !== ""){
      requestObject.data.sort = requestObject.data.order === "desc" ? ("-"+requestObject.data.sort) : requestObject.data.sort;
    }
    Backbone.PageableCollection.prototype.sync.apply(this, arguments);
  }
});


export default GridCollection;