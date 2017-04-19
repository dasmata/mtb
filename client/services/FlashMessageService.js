"use strict";
let Service = require("./Service");

/**
 * Class that represents a flash message
 */
class FlashMessage {

    /**
     * @constructor
     * @param {string} type - The type of the flash message: warning | info | error | success
     * @param {string} message - The message of the flash message
     */
    constructor(type, message) {
        let data = {
            type: type,
            message: message
        };
        Object.defineProperty(this, "data", {
            __proto__: null,
            get: ()=>{
                return data;
            },
            set: (_value)=>{
                throw new Error("Undefined property: data");
            },
            enumerable: false,
            configurable: false
        });
    }

    /**
     * @returns {string} - The flash message type
     */
    get type() {
        return this.data.type;
    }

    /**
     * @returns {string} - The message text
     */
    get message() {
        return this.data.message;
    }
}

let messages = [];

/**
 * Class that handles the flash messages
 */
class FlashMessageService extends Service {

    /**
     * Ads a flash message to the stack
     *
     * @param {string} type - The type of the flash message: warning | info | error | success
     * @param {string} message - The message of the flash message
     * @returns {FlashMessageService} - The current object
     */
    add(type, message) {
        let msg = this.generateFlashMessageObject(type, message);
        messages.push(msg);
        this.trigger("add", msg);
    }

    /**
     * Returns all defined flash messages and removes them
     *
     * @returns {Array} - The defined flash messages
     */
    getAll() {
        let tmp = messages;
        messages = [];
        return tmp;
    }

    /**
     * Generates and instance of a flash message object
     *
     * @param {string} type - The type of the flash message: warning | info | error | success
     * @param {string} message - The message of the flash message
     * @returns {FlashMessage} - The generated FlashMessage object
     */
    generateFlashMessageObject(type, message){
        return new FlashMessage(type, message);
    }
}

module.exports = FlashMessageService;


