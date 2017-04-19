"use strict";
var Layout = require("./Layout");


module.exports = Layout.extend({
    el: "body",

    /**
     * @constructor
     */
    initialize: function () {
        this.children = [];
        this.contentContainer = $(document.createElement("section")).attr("id", "content");
    },

    /**
     * @inheritDoc
     */
    detachHeader: function () {
        return this;
    },

    /**
     * @inheritDoc
     */
    detachFooter: function () {
        return this;
    },

    /**
     * @inheritDoc
     */
    render(){
        this.$el.html("");
        this.$el.append(this.contentContainer);
        this.render = function () {
            return this;
        };
        return this;
    },

    /**
     * Renders the content section of the layout
     *
     * @param {Backbone.View} contentView The vie that represents the content
     * @returns {undefined}
     */
    renderContent(contentView){
        this.contentContainer.html(contentView.render().el);
    },

    remove(){
        this.$("#content").remove();
    }
});
