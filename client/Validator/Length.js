"use strict";

import BetweenValidator from "./Between";

class Length extends BetweenValidator{

  constructor(options){
    super(options);
    this.message = "Invalid value";
  }

  validate(value){
    return super.validate(value.length);
  }

}

export default Length;
