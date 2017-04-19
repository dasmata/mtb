"use strict";
let Abstract = require("./Abstract");

module.exports = Abstract.extend({

    /**
     * @constructor
     * @param {string} type - The message's type: warning | info | success | error
     */
    initialize(type){
        this.type = type;
    },


    /**
     * Renders a flash message
     *
     * @param {string} message - The message
     * @returns {FlashMessage} - The current object
     */
    render(message){
        this.$el.addClass(this.type).text(message);
        return this;
    },

    /**
     * Removes the view's html element from the DOM
     *
     * @fires FlashMessage#remove
     * @returns {undefined}
     */
    remove(){
        /**
         * Remove event. Triggered when the message is removed from the DOM
         *
         * @event FlashMessage#remove
         */
        this.trigger("remove");
        Abstract.prototype.remove.call(this);
    }
});
