"use strict";

import DashboardView from "../Views/Dashboard";
import AbstractController from "./Abstract";

class DashboardController extends AbstractController{

  get actions(){
    return {
      "adminDashboard": "index"
    }
  }

  indexAction(){
    this.view = new DashboardView();
    this.view.render();
  }
}

export default (new DashboardController());
