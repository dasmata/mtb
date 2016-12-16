"use strict";

import ProductsView from "../Views/Products";
import AbstractController from "./Abstract";

class ProductsController extends AbstractController{
  get actions(){
    return {
      "adminProducts": "index"
    }
  }

  indexAction(){
    this.view = new ProductsView();
    this.view.render();
  }
}

export default (new ProductsController());