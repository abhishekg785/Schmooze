/*
* author: abhishek goswami
* abhishekg785@gmail.com
*
* app.js : conatins the necessary requirements for the project
*/

module.exports = function(app, io, express) {
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var cookie = require('cookie');
  var connect = require('connect');
  var config = require('./config');
  var mongoose = require('mongoose');
  var flash = require('connect-flash');

  /* redis part */
  var redis = require('redis');
  var redisClient = redis.createClient();
  var RedisStore = require('connect-redis')(session);
  var redisStore = new RedisStore({ client: redisClient });

  /* mongodb connection */
  var connection = require('./models/db_connect.js');

  /* other redis stuff */
  var sessionService = require('./shared/session-service');
  var socketFunctions = require('./shared/socketFunctions');
  var HTMLCutter = require('./shared/HTMLCutter');

  sessionService.initializeRedis(redisClient, redisStore);

  var routes = require('./routes/index');
  var chat = require('./routes/chat');
  var channel = require('./routes/channel');
  var logoutEvent = require('./routes/logoutEvent')(io);
  var checkForCommand = require('./shared/checkForCommand');

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser(config.sessionSecret));
  app.use(session({
    store: redisStore,
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
    key:config.sessionCookieKey
  }));
  app.use(flash());
  app.use(express.static(path.join(__dirname, 'public')));


  app.use('/', routes);
  app.use('/chat',chat);
  app.use('/channel',channel);
  app.use('/logoutEvent', logoutEvent.index);


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  //socket connections
  //socket.io middleware
  var socketMiddleware = require('./routes/socket_routes/socketMiddleware')(io);

  //we listen for the sockets connecting to the server here
  var socketHandler = require('./routes/socket_routes/socketHandler')(io);

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
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
  
}
