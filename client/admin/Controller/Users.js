"use strict";

import UsersView from "../Views/Users";
import AbstractController from "./Abstract";

class UsersController extends AbstractController{

  get actions(){
    return {
      "adminUsers": "index"
    }
  }

  indexAction(){
    this.view = new UsersView();
    this.view.render();
  }
}

export default (new UsersController());