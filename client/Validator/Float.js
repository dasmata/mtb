"use strict";

import AbstractValidator from "./Abstract";

class Float extends AbstractValidator {

  constructor(){
    super();
    this.message = "The value is not a float number";
  }

  validate(value){
    return !isNaN(parseFloat(value));
  }

}

export default Float;
