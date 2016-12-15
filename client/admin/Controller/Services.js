"use strict";

import ServicesView from "../Views/Services";

app.router.on("route:adminServices", function(){
  var view = new ServicesView();
  view.render();
});