"use strict";
import DashboardController from "./admin/Controller/Dashboard";
import UsersController from "./admin/Controller/Users";
import ServicesController from "./admin/Controller/Services";

require("../node_modules/backgrid/lib/backgrid.css");
require("backbone-forms");

var routes = {
  "admin": "adminDashboard",
  "admin/services": "adminServices",
  "admin/products": "adminProducts",
  "admin/promotions": "adminPromotions",
  "admin/orders": "adminOrders",
  "admin/users": "adminUsers"
};

for(var i in routes){
  app.router.route(i, routes[i]);
}

$(document).one("loaded.admin", function(){
  var path = window.location.pathname.replace(/^\//, "");
  for(var i in routes){
    if(i === path){
      app.router.trigger("route:" + routes[i]);
      break;
    }
  }

});
$(document).trigger("loaded.admin");
