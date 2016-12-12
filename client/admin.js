"use strict";
import DashboardController from "./admin/Controller/Dashboard";

require("backbone-forms");
require("../node_modules/backgrid/lib/backgrid.css");

app.router.route("/admin", "adminDashboard");
app.router.route("/admin/services", "adminServices");
app.router.route("/admin/products", "adminProducts");
app.router.route("/admin/promotions", "adminPromotions");
app.router.route("/admin/orders", "adminOrders");
app.router.route("/admin/clients", "adminClients");

$(document).trigger("loaded.admin");
app.router.trigger("route:dashboard");
