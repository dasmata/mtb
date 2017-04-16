"use strict";
/**
 * Abstract validator class
 */
class AbstractValidator {

    /**
     * @constructor
     */
    constructor() {
        this.message = "";
    }

    /**
     * Validation method
     *
     * @param {string|array|object} value the value to be validated
     * @returns {boolean} ture if valid, false otherwise
     */
    validate(value) {
        throw new Error("This method must be implemented in the concrete class", value);
    }

    /**
     * Retuns the validation message
     *
     * @returns {string|*} The validation message
     */
    getMessage() {
        return this.message;
    }

    /**
     * Changes the validation message
     *
     * @param {string} txt The message text
     * @returns {undefined}
     */
    setMessage(txt) {
        this.message = txt;
    }

}

module.exports = AbstractValidator;
