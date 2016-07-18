/*
* author: abhishek goswami
* abhishekg785@gmail.com
*
* socket.io main flow code here
*/

var express = require('express');
module.exports = function(app,io){
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');

  var routes = require('./routes/index');
  var chat = require('./routes/chat');

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({
    secret:'life_is_strange'
  }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);
  app.use('/chat',chat);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  //socket connections
  //socket.io authorization
  io.set('authorization', function(handshakeData, accept){
    console.log('auth');
  });

  //we listen for the sockets connecting to the server here
  io.sockets.on('connection',function(socket){
  });

  // error handlers

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
