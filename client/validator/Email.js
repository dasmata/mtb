"use strict";

var RegularExpressionValidator = require("./RegularExpression");

/**
 * Validates an email address
 */
class EmailValidator extends RegularExpressionValidator {

    /**
     * @constructor
     */
    constructor() {
        //eregex source: http://emailregex.com/
        super(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        this.message = "Adresa de email nu este valida";
    }

}

module.exports = EmailValidator;
