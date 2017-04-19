"use strict";

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let Sequelize = require('sequelize');
let config = require("./app/config/config.js")[process.env.NODE_ENV || "production"];
let api = require("./app/api.js");

/**
 * @todo Use this as the name of the admin.js file after it is processed by webpack
 */
// var serialNumber = require('serial-number');
// serialNumber(function (err, value) {
//   console.log(value);
// });


let sequelize = new Sequelize(config.database.dbname, config.database.user, config.database.password, {
    host: config.database.host,
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        classMethods: {
            models: function () {
                return models;
            }
        }
    }
});
let routes = require('./routes/index');
let users = require('./routes/users');

let app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('config', config);
app.set('mailer', require("./app/Mailer")(app));
app.locals.script = function (script) {
    return config.client_js + script;
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'all4mtb0.png')));
app.use(logger('dev'));
app.use(cookieParser());


let models = require('./app/models')(sequelize);
app.set('db', models);

sequelize.sync({force: false}).then(function () {
    app.use('/auth/users', users);
    api(app, sequelize);
    app.use('/', routes);

});

module.exports = app;