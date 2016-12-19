"use strict";
import DashboardController from "./admin/Controller/Dashboard";
import UsersController from "./admin/Controller/Users";
import ServicesController from "./admin/Controller/Services";
import ProductsController from "./admin/Controller/Products";
import OrdersController from "./admin/Controller/Orders";

require("backbone-forms");
require("./admin/GridFormType/ModelsList");
require("../node_modules/backgrid/lib/backgrid.css");

var adminApp = {
  routes : {
    "admin": "adminDashboard",

    // SERVICES ACTIONS
    "admin/services": "adminServices",
    "admin/services/add": "adminAddServices",
    "admin/services/edit/id": "adminEditServices",
    //END SERVICES ACTIONS

    // PRODUCTS ACTIONS
    "admin/products": "adminProducts",
    //END PRODUCTS ACTIONS

    // PROMOTIONS ACTIONS
    "admin/promotions": "adminPromotions",
    //END PROMOTIONS ACTIONS

    // ORDERS ACTIONS
    "admin/orders": "adminOrders",
    //END ORDERS ACTIONS

    // USERS ACTIONS
    "admin/users": "adminUsers"
    //END USERS ACTIONS
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
