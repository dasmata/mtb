"use strict";
import DashboardController from "./admin/Controller/Dashboard";
import UsersController from "./admin/Controller/Users";
import ServicesController from "./admin/Controller/Services";

require("../node_modules/backgrid/lib/backgrid.css");
require("backbone-forms");

var adminApp = {
  routes : {
    "admin": "adminDashboard",
    "admin/services": "adminServices",
    "admin/products": "adminProducts",
    "admin/promotions": "adminPromotions",
    "admin/orders": "adminOrders",
    "admin/users": "adminUsers"
  },
  init(){
    this.registerRoutes();
    this.setActions();
    $(document).trigger("loaded.admin");
  },
  setActions(){
    $(document).one("loaded.admin", ()=>{
      var path = window.location.pathname.replace(/^\//, "");
      for(var i in this.routes){
        if(i === path){
          app.router.trigger("route:" + this.routes[i]);
          break;
        }
      }
    });
    $(document).on("page.change", (e, controller)=>{
      if(this.controller){
        this.controller.cleanup();
      }
      this.controller = controller;
    });
  },
  registerRoutes(){
    for(var i in this.routes){
      app.router.route(i, this.routes[i]);
    }
  }
};

adminApp.init();
