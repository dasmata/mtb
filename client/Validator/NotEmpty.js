"use strict";

import AbstractValidator from "./Abstract";

class NotEmpty extends AbstractValidator {

  constructor(){
    super();
    this.message = "Acest camp este obligatoriu";
  }

  validate(value){
    return typeof value !== "undefined" && value !== null && value !== "";
  }

}

export default NotEmpty;
