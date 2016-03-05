var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var routes = require('./routes/index');
var userRoute = require('./routes/users');
var categoryRoute = require('./routes/category');
var recipeRoute = require('./routes/recipe');
var dataRoute = require('./routes/data')
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var models = require('./models');
var dbaseConfig = require('./models/config.json');
var connector = require('./models/connector');
var seed = require('./seed');
var utils = require('./utils');
var app = express();

var multiparty = require('multiparty');
//set to qa server
connector(mongoose, dbaseConfig.qa);
require('./config/passport')(passport);

//seed(models, require('mongodb').ObjectID);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'iyamnotsouthhero'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', routes);
app.use('/api/user', userRoute.registerRoutes(models, passport, multiparty, utils));
app.use('/api/category', categoryRoute.registerRoutes(models));
app.use('/api/recipe', recipeRoute.registerRoutes(models, multiparty, utils));
app.use('/api/data', dataRoute.registerRoutes(models));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
