"use strict";
import User from "../Models/User";
Backbone.PageableCollection = require("backbone.paginator");

var Users = Backbone.PageableCollection.extend({
  "url": "/api/users",
  "model": User,
  "state": {
    firstPage: 0,
    pageSize: 25
  },
  "queryParams": {
    currentPage: "page",
    pageSize: "count"
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


export default Users;
