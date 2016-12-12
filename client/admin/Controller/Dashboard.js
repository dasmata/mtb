"use strict";

import DashboardView from "../Views/Dashboard";

app.router.on("route:dashboard", function(){
  var view = new DashboardView();
  view.render();
});
