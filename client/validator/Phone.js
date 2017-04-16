"use strict";

var RegularExpressionValidator = require("./RegularExpression");

/**
 * Validates a phone number
 */
class PhoneValidator extends RegularExpressionValidator {

    /**
     * @constructor
     */
    constructor() {
        super(/^\+40\d{9}$/);
        this.message = "Numarul de telefon nu este valid";
    }

}

module.exports = PhoneValidator;