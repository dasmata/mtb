"use strict";

import ServicesView from "../Views/Services";
import AbstractController from "./Abstract";

class ServicesController extends AbstractController{
  get actions(){
    return {
      "adminServices": "index"
    }
  }

  indexAction(){
    this.view = new ServicesView();
    this.view.render();
  }
}

export default (new ServicesController());