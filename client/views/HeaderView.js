"use strict";
var AbstractView = require("./Abstract");
var headerTpl = require("../templates/header.jade");
var menuItemTpl = require("../templates/header/menu-item.jade");

module.exports = AbstractView.extend({
    events: {
        "click #navbar-menu a": function(e){
            this.activity.navigate($(e.currentTarget).attr(href), {trigger: true});
        }
    },
    /**
     * @constructor
     */
    initialize(){
        this.setElement(headerTpl());
        this.menuHolder= this.$("#navbar-menu");
    },
    /**
     * Renders the header section
     *
     * @returns {HeaderView} The current object
     */
    render(){
        this.activity.getUserMenu().then((collection)=>{
            this.menuHolder.html("");
            collection.forEach((el)=>{
                this.renderMenuItem(el).then((el)=>{
                    this.menuHolder.append(el);
                });
            });
        }).catch(function(){});
        return this;
    },
    /**
     * reates the DOM element for the menu items
     * @param {Backbone.Model} el - The model of the menu element
     * @returns {Promise} - The promise that will be fulfilled when the item is rendered
     */
    renderMenuItem(el){
        return new Promise(function(done){
            setTimeout(function(){
                var htmlEl = $(menuItemTpl({label: el.get("label"), url: el.get("url")}));
                done(htmlEl);
            }, 1);
        });
    }
});
