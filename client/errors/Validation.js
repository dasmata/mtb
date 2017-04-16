"use strict";

/**
 * Class to represent a form validation error
 */
class ValidationError extends Error {

    /**
     * @constructor
     * @param {string} text The error message
     * @param {string} element The field name
     */
    constructor(text, element) {
        super(text);
        this.element = element;
    }

    /**
     * Returns the message of the error
     * @params {string} - The message of th error
     */
    get message() {
        return this.text;
    }

    /**
     * returns the name of the field
     * @returns {string|*} - The name of the field
     */
    get fieldName() {
        return this.element;
    }
}

module.exports = ValidationError;
