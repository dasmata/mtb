"use strict";

var AbstractValidator = require("./Abstract");

/**
 * Class that validates integers
 */
class Int extends AbstractValidator {

    /**
     * @constructor
     */
    constructor() {
        super();
        this.message = "The value is not a number";
    }

    /**
     * @inheritdoc
     */
    validate(value) {
        var intVal = parseInt(value, 10);
        return !isNaN(intVal) && intVal !== parseFloat(value);
    }

}

module.exports = Int;
