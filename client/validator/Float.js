"use strict";

var AbstractValidator = require("./Abstract");

/**
 * Class that validates a float value
 */
class Float extends AbstractValidator {

    /**
     * @constructor
     */
    constructor() {
        super();
        this.message = "The value is not a float number";
    }

    /**
     * @inheritDoc
     */
    validate(value) {
        return !isNaN(parseFloat(value));
    }
}

module.exports = Float;
