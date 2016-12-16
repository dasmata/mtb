"use strict";

import AbstractValidator from "./Abstract";

class Int extends AbstractValidator {

  constructor(){
    super();
    this.message = "The value is not a number";
  }

  validate(value){
    var intVal = parseInt(value, 10);
    return !isNaN(intVal) && intVal !== parseFloat(value);
  }

}

export default Int;
