"use strict";
import Login from "./Login.js";
import Register from "./Register.js";
import LoginService from "../Service/Login.js";

var userMenu = require("../templates/usermenu.jade");

var UserInfo = Backbone.View.extend({
  "el": "#user-info",
  "events": {
    "click #logout": "logout",
    "click #register-action": "showRegisterForm",
    "hidden.bs.dropdown": "render"
  },

  "initialize": function () {
    this.loginForm = new Login();
    this.registerForm = new Register();
    this.menu = $(userMenu());
    this.dropdownHolder = this.$(".dropdown-menu");
    this.setActions();
    this.render();
  },
  "setActions": function () {
    $(document).on("authenticate logout", ()=> {
      this.render();
      this.$el.removeClass("open");
    });
  },
  "show": function () {
    this.$el.show();
  },
  "render": function () {
    this.registerForm.remove();
    if (security.isAuth()) {
      this.createMenuDropdown();
      return;
    }
    this.removeMenuDropdown();
  },
  "showRegisterForm": function (e) {
    if (security.isAuth()) {
      return;
    }
    this.menu.detach();
    this.loginForm.remove();
    this.dropdownHolder.append(this.registerForm.$el);
    this.$el.addClass("open");
    e.stopPropagation();
    e.preventDefault();
  },
  "createMenuDropdown": function () {
    this.loginForm.remove();
    this.registerForm.remove();
    this.dropdownHolder.append(this.menu);
  },
  "removeMenuDropdown": function () {
    this.menu.detach();
    this.dropdownHolder.append(this.loginForm.$el);
    this.loginForm.render();
  },
  "logout": function () {
    this.getService().logout();
  },
  "getService": function () {
    return this.service ? this.service : this.service = new LoginService();
  },
});

module.exports = UserInfo;