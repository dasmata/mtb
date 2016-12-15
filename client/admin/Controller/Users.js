"use strict";

import UsersView from "../Views/Users";

app.router.on("route:adminUsers", function(){
  var view = new UsersView();
  view.render();
});