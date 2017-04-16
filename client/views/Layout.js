"use strict";

var AbstractView = require("./Abstract");
var HeaderView = require("./HeaderView");

/**
 * The layout view class
 */
module.exports = AbstractView.extend({
    el: "body",

    /**
     * @constructor
     */
    initialize: function () {
        this.headerContainer = $(document.createElement('section')).attr("id", "header");
        this.footerContainer = $(document.createElement('section')).attr("id", "footer");
        this.contentContainer = $(document.createElement('section')).attr("id", "content");
        this.headerView = new HeaderView({activity: this.activity});
    },
    /**
     * Renders the layout and distrys the render method to ensure the layut is rendered only once
     * @returns {Backbone.View} The current object
     */
    render: function () {
        this.headerView.setActivity(this.activity);
        this.buildLayout();
        this.render = function () {
            this.headerView.setActivity(this.activity);
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
    remove: function(){
        this.headerView.remove();
        AbstractView.prototype.remove.call(this);
    }
});
