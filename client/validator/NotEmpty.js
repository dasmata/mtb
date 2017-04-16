"use strict";

var AbstractValidator = require("./Abstract");

/**
 * Class that validates a non empty value
 */
class NotEmpty extends AbstractValidator {

    /**
     * @constructor
     */
    constructor() {
        super();
        this.message = "Acest camp este obligatoriu";
    }

    /**
     * @inheritdoc
     */
    validate(value) {
        return typeof value !== "undefined" && value !== null && value !== "";
    }

}

module.exports = NotEmpty;
