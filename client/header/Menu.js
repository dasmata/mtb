"use strict";

import UserMenu from "../Collections/UserMenu";

var Menu = Backbone.View.extend({
  "el": "#main-menu",
  initialize(){
    this.additionalMenu = $();
    this.setActions();
    if(menu !== null && menu.length > 0){
      this.buildAdditionMenu(new Backbone.Collection(menu));
    }
    this.toggleRegularMenu();
  },
  setActions(){
    $(document).on("authenticate logout", (e)=>{
      if(security.isAuth()){
        app.router.navigate("/admin", {trigger: true});
      } else if(this.isAdminPage()){
        window.location = "/";
      }
      this.toggleRegularMenu();
      this.updateMenu();
    });
    $(document).on("navigate.admin", ()=>{
      this.adminPage = true;
    });
    $(document).on("navigate.user", ()=>{
      this.adminPage = false;
    });
  },
  isAdminPage(){
    return this.adminPage;
  },
  toggleRegularMenu(){
    if(!security.isAuth()){
      this.$("> ul > li:not(.admin-menu):not(#user-info)").show();
      return;
    }
    if(this.additionalMenu.length > 0){
      this.$("> ul > li:not(.admin-menu):not(#user-info)").hide();
    } else {
      this.$("> ul > li:not(.admin-menu):not(#user-info)").show();
    }
  },
  updateMenu(){
    if(!security.isAuth() && this.additionalMenu.length > 0){
      this.removeAdditionalMenu();
    } else if(security.isAuth()){
      this.getUserMenu().then((collection)=>{
        this.buildAdditionMenu(collection);
        this.toggleRegularMenu();
      }).catch(()=>{
        console.warn("could not return additional menu");
      });
    }
  },
  buildAdditionMenu(collection){
    var buildButton = (model)=>{
      var $el;
      if(typeof model.get("children") === "undefined"){
        $el = this.$("li:not(.dropdown):first").clone().addClass("admin-menu").show();
        $el.find("a")
          .text(model.get("label"))
          .attr("href", model.get("url"));
      } else {
        $el = this.$("li.dropdown:first").clone().addClass("admin-menu").removeClass("open");;
        $el.find("ul.dropdown-menu").html("");
        $el.find("a")
          .html("")
          .text(model.get("label"))
          .addClass("dropdown-toggle")
          .attr("data-toggle", "dropdown")
          .append($("<span>").addClass("caret").html("&nbsp;"));
        model.get("children").forEach((child)=>{
          $el.find("ul.dropdown-menu")
            .append(buildButton(new Backbone.Model(child)));
        });
      }
      this.additionalMenu = this.additionalMenu.add($el[0]);
      return $el;
    };
    collection.forEach((model)=>{
      this.$("#navbar-menu").append(buildButton(model));
    });
    $(document).trigger("complete.menu");
  },
  getUserMenu(){
    return new Promise((done, fail)=>{
      var collection = new UserMenu();
      this.listenTo(collection, "sync", function(){
        done(collection);
        this.stopListening(collection);
      });
      this.listenTo(collection, "error", function(){
        fail();
        this.stopListening(collection);
      });
      collection.fetch();
    });
  },
  removeAdditionalMenu(){
    this.additionalMenu.remove();
  }
});

export default Menu;
