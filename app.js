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

var sequelize = new Sequelize('mtb', 'mtb', '|oo54sn_vsl72n*5', {
    host: '127.0.0.1',
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

var app = express();

models = require('./app/models')(sequelize);

app.set('db', models);
sequelize.sync({force: true}).then(function(){
    "use strict";
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.locals.test = function(script){
        return "http://127.0.0.1:8080/js/" + script;
    };

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(session({
        secret: "buhuhu-n pizda ma-tii ca m-ai speriat",
        saveUninitialized: true,
        cookie: { secure: false },
        resave: false,
        store: new Store(sequelize),
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));


    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    app.use('/', routes);
    app.use('/users', users);

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