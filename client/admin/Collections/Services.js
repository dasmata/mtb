"use strict";
import Service from "../Models/Service";
Backbone.PageableCollection = require("backbone.paginator");

var Services = Backbone.PageableCollection.extend({
  "url": "/api/services",
  "model": Service,
  "state": {
    firstPage: 0,
    pageSize: 25
  },
  "queryParams": {
    currentPage: "page",
    pageSize: "count",
    q: ""
  },
  "parse": function(data, obj){
    var ranges = obj.xhr.getResponseHeader("Content-Range").replace("items ", "").split("/");
    var limits = ranges[0].split("-");
    this.state.totalRecords = parseInt(ranges[1], 10);
    this.state.totalPages = Math.ceil(ranges[1] / this.state.pageSize);
    this.state.lastPage = this.state.totalPages - 1;
    return data;
  }
});


export default Services;
