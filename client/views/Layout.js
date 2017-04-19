"use strict";

let AbstractView = require("./Abstract");
let HeaderView = require("./HeaderView");
let FlashMessageView = require("./FlashMessage");

/**
 * The layout view class
 */
module.exports = AbstractView.extend({
    el: "body",

    /**
     * @constructor
     */
    initialize: function () {
        this.children = [];
        this.headerContainer = $(document.createElement('section')).attr("id", "header");
        this.footerContainer = $(document.createElement('section')).attr("id", "footer");
        this.contentContainer = $(document.createElement('section')).attr("id", "content");
        this.headerView = new HeaderView({activity: this.activity});
        this.children.push(this.headerView);
    },
    /**
     * Renders the layout and distrys the render method to ensure the layut is rendered only once
     * @returns {Backbone.View} The current object
     */
    render: function () {
        this.headerView.setActivity(this.activity);
        this.buildLayout();
        this.render = function () {
            this.children.forEach((el) => {
                el.setActivity(this.activity);
            });
            return this;
        }.bind(this);
        return this;
    },
    /**
     * Renders the content section of the layout
     *
     * @param {Backbone.View} contentView The vie that represents the content
     * @returns {undefined}
     */
    renderContent: function (contentView) {
        this.contentContainer.html(contentView.render().el);
    },

    /**
     * detaches the header section
     *
     * @returns {Backbone.View} The current object
     */
    detachHeader: function () {
        this.headerContainer.detach();
        return this;
    },

    /**
     * Detaches the footer section
     *
     * @returns {Backbone.View} Themcurrent object
     */
    detachFooter: function () {
        this.footerContainer.detach();
        return this;
    },

    /**
     * Builds the base DOM nodes structure for the layout
     *
     * @returns {undefined}
     * @private
     */
    buildLayout: function () {
        this.$el.append(this.headerContainer);
        this.$el.append(this.contentContainer);
        this.$el.append(this.footerContainer);
        this.headerContainer.append(this.headerView.render().el);
    },

    /**
     * Removes the Layout elements
     *
     * @returns {undefined}
     */
    remove: function () {
        this.children.forEach((el) => {
            el.remove();
        });
        AbstractView.prototype.remove.call(this);
    },

    /**
     * Renders a generic error
     *
     * @param {Error} error - The error to be rendered
     * @returns {undefined}
     */
    renderGenericError: function (error) {
        this.renderFlashMessage(this.activity.context.di.get("flashMessage").generateFlashMessageObject("error", error.message));
    },

    /**
     * Renders a flash message
     *
     * @param {FlashMessage} msg - The message that should be displayed
     * @returns {undefined}
     */
    renderFlashMessage: function (msg) {
        let view = new FlashMessageView(msg.type);
        this.children.push(view);
        this.listenToOnce(view, "remove", function(){
            this.children = this.children.reduce(function(arr, el){
                if(el !== view){
                    arr.push(el);
                }
                return arr;
            }, []);
            view = null;
        });
        this.contentContainer.prepend(view.render(msg.message).el);
    },

    /**
     * Removes the generic errors that are rendered
     *
     * @returns {undefined}
     */
    resetGenericErrors: function(){
        this.removeFlashMessages("error");
    },

    /**
     * Removes all the flash messages of a certain type
     *
     * @param {string|undefined} type - The type of messages that will be removed
     * @returns {undefined}
     */
    removeFlashMessages: function(type){
        this.children.forEach((el)=>{
            if(el instanceof FlashMessageView && (typeof type === "undefined" || el.type === type)){
                this.removeFlashMessage(el);
            }
        });
    },

    /**
     * Removes a flash message
     *
     * @param {FlashMessageView} view - The Flash message object that will be removed
     * @returns {undefined}
     */
    removeFlashMessage: function(view){
        view.remove();
    }
});
