"use strict";
import RegularExpressionValidator from "./RegularExpression";

class PhoneValidator extends RegularExpressionValidator{

  constructor(){
    super(/^\+40\d{9}$/);
    this.message = "Numarul de telefon nu este valid";
  }

}

export default PhoneValidator;