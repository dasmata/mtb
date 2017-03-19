"use strict";

/**
 * The layout view class
 */
module.exports = Backbone.View.extend({
    el: "body",

    /**
     * @constructor
     */
    initialize: function () {
        this.headerContainer = $(document.createElement('section')).attr("id", "header");
        this.footerContainer = $(document.createElement('section')).attr("id", "footer");
        this.contentContainer = $(document.createElement('section')).attr("id", "content");
    },
    /**
     * Renders the layout and distrys the render method to ensure the layut is rendered only once
     * @returns {Backbone.View} The current object
     */
    render: function () {
        this.buildLayout();
        this.render = function () {
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
    }
});
