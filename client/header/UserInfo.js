"use strict";
import Backbone from "backbone";
import $ from "jquery";
import Login from "./Login.js";
import LoginService from "../Service/Login.js";

var userMenu = require("pug!../templates/usermenu.jade");

var UserInfo = Backbone.View.extend({
    "el": "#user-info",
    "events": {
        "click #logout": "logout"
    },
    "initialize": function(){
        this.loginForm = new Login();
        this.menu = $(userMenu());
        this.setActions();
        this.render();
    },
    "setActions": function(){
        $(document).on("authenticate logout", ()=>{
            this.render();
        });
    },
    "show": function(){
        this.$el.show();
    },
    "render": function(){
        if(security.isAuth()){
            this.loginForm.remove();
            this.createDropdown();
            return;
        }
        this.removeDropdown();
        this.$(".dropdown-menu").append(this.loginForm.$el);
        this.loginForm.render();
    },
    "createDropdown": function(){
        this.$(".dropdown-menu").append(this.menu);
    },
    "removeDropdown": function(){
        this.menu.detach();
    },
    "logout": function(){
        this.getService().logout();
    },
    "getService": function(){
        return this.service ? this.service : this.service = new LoginService();
    },
});

export default UserInfo;