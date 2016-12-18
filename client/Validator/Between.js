"use strict";

import AbstractValidator from "./Abstract";

class Between extends AbstractValidator {

  constructor(options){
    super();
    this.message = "Invalid value";
    this.min = typeof options.min === "number" ? options.min : null;
    this.max = typeof options.max === "number" ? options.max : null;
  }

  validate(value){
    var valid = 1;
    var intVal = parseInt(value, 10);

    if(this.min !== null && intVal < this.min){
      valid &= 0;
    }

    if(this.max !== null && intVal > this.max){
      valid &= 0;
    }

    return valid;
  }

}

export default Between;