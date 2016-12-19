"use strict";

import OrdersView from "../Views/Orders";
import AbstractController from "./Abstract";

class OrdersController extends AbstractController{
  get actions(){
    return {
      "adminOrders": "index"
    }
  }

  indexAction(){
    this.view = new OrdersView();
    this.view.render();
  }
}

export default (new OrdersController());
