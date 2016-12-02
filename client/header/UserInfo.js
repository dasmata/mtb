"use strict";
import Backbone from "backbone";
import $ from "jquery";

var UserInfo = Backbone.View.extend({
    "el": "#user-info",
    "initialize": function(){
        this.setActions();
        this.render();
    },
    "setActions": function(){
        $(document).on("authenticate", ()=>{
            this.render();
        });
    },
    "show": function(){
        this.$el.show();
    },
    "render": function(){
        if(security.isAuth()){
            this.$el.show();
            return;
        }
        this.$el.hide();
    }
});

export default UserInfo;