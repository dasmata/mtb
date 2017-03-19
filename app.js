"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var passport = require("passport");
var session = require("express-session");
var Store = require("express-sequelize-session")(session.Store);
var config = require("./app/config/config.js")[process.env.NODE_ENV || "production"];
var api = require("./app/api.js");
var LocalStrategy = require('passport-local').Strategy;
var acl = require("./app/acl");

/**
 * @todo Use this as the name of the admin.js file after it is processed by webpack
 */
// var serialNumber = require('serial-number');
// serialNumber(function (err, value) {
//   console.log(value);
// });


var sequelize = new Sequelize(config.database.dbname, config.database.user, config.database.password, {
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
var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('config', config);
app.locals.script = function (script) {
    return config.client_js + script;
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());


var models = require('./app/models')(sequelize);
app.set('db', models);

sequelize.sync({force: false}).then(function () {
    app.use(session({
        secret: "buhuhu-n pizda ma-tii ca m-ai speriat",
        saveUninitialized: true,
        cookie: {secure: false},
        resave: false,
        store: new Store(sequelize),
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        function (username, password, done) {
            models.Users.findOne({where: {username: username}}).then(function (user) {
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);
            }).catch(function (err) {
                return done(err);
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    app.use(acl.setUser);

    app.use('/api/users', users);
    app.use('/admin', admin);
    api(app, sequelize);
    app.use('/', routes);

    // catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //     var err = new Error('Not Found');
    //     err.status = 404;
    //     next(err);
    // });

    // error handlers

    // development error handler
    // will print stacktrace
    // if (app.get('env') === 'development') {
    //     app.use(function(err, req, res, next) {
    //         res.status(err.status || 500);
    //         res.render('error', {
    //             message: err.message,
    //             error: err
    //         });
    //     });
    // }

    // production error handler
    // no stacktraces leaked to user
    // app.use(function(err, req, res, next) {
    //     res.status(err.status || 500);
    //     res.render('error', {
    //         message: err.message,
    //         error: {}
    //     });
    // });
});


module.exports = app;