"use strict";
var Abstract = require("./Abstract");


module.exports = Abstract.extend({
    el: "body",

    render(){
        this.$el.html("");
        this.$el.append(this.contentSection = $(document.createElement("section")).attr("id", "content"));
        this.render = function(){
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
        this.contentSection.html(contentView.render().el);
    },

    remove(){
        this.$("#content").remove();
    }
});
