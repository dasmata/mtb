"use strict";

app.router.route("/admin", "adminDashboard");
app.router.route("/admin/services", "adminServices");
app.router.route("/admin/products", "adminProducts");
app.router.route("/admin/promotions", "adminPromotions");
app.router.route("/admin/orders", "adminOrders");
app.router.route("/admin/clients", "adminClients");

app.router.on("route:dashboard", function(){
  console.log(arguments);
});

app.router.trigger("route:dashboard");
$(document).trigger("loaded.admin");
