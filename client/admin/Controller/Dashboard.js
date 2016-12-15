"use strict";

import DashboardView from "../Views/Dashboard";

app.router.on("route:adminDashboard", function(){
  var view = new DashboardView();
  view.render();
});
