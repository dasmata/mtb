"use strict";

import AbstractValidator from "./Abstract";

class RegExpValidator extends AbstractValidator{

  constructor(pattern){
    super();
    this.pattern = pattern;
  }

  validate(value){
    return this.pattern.test(value);
  }
}

export default RegExpValidator;
