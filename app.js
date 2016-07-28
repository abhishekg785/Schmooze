/*
* author: abhishek goswami
* abhishekg785@gmail.com
*
* socket.io main flow code here
*/

module.exports = function(app, io, express){
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
  mongoose.connect('mongodb://localhost/schmooze', function(err){
    if(!err){
      console.log('connected to database');
    }
    else{
      console.log('Error' + err);
    }
  });

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
  //it will get the username from the session cookie and store it in redis store and thus we can use the things later in our app
  io.use(function(socket, next){
    console.log('in the middleware');
    var parseCookie = cookieParser(config.sessionSecret),
        handshake = socket.request,
        channelName = socket.handshake['query']['channelName'];
        console.log('CHANNEL NAME' + channelName);

    parseCookie(handshake, null, function (err, data) {
      sessionService.get(handshake, function (err, session) {
        if(err){
          console.log(err);
        }
        if(!session){
          console.log('no session');
        }
        handshake.session = session;   //setting handshake.session equal to the session we fetched using cookie id which is further fetched from cookie using cookieParser

        /*
        * get username from the session using getUserName from sessionService
        * store it in the socket.username
        * check if user exists in users array: if exists then do not append into the array else vice versa
        */

        sessionService.getUserName(handshake,function(err, username){
          if(username && username != undefined){
            usernameIndex = socketFunctions.getUserIndex(username);
            if(usernameIndex == -1){
              socketFunctions.addNewUser(username);
              //add the array for storing socketIDS in the userSocketIds array
              socketFunctions.initializeUserSocketIds();
              }
            socket.username = username;
            socket.id = socket.id;
            socketFunctions.addNewUserSocketObject(username, socket);
            next();
          }
          // else{
          //   socket.emit('disconnect', 'You have been Disconnected');
          // }
        });
      });
    });
  });

  //we listen for the sockets connecting to the server here
  io.sockets.on('connection',function(socket){
    var logString = socket.username + ' Connected';
    /*
    *  manage channel part here
    *  push channel name into the channels array and make the push [] into the channelUsers
    *  for storing users in a particular channel
    *  check if channel exists in the channels array i.e index != -1 and if does not exists then take the above steps
    */
    var channelName = socket.handshake['query']['channelName'];
    console.log(channelName);
    if(channelName){
      console.log('SETTING DATA FOR CHANNEL');
      socket.join(channelName);
      socket.channelName = channelName;
      var channelIndex = socketFunctions.getChannelIndex(socket.channelName);
      if(channelIndex == -1){
        socketFunctions.addNewChannel(socket.channelName);
        socketFunctions.initializeChannelUsersArray();
      }
      socketFunctions.addUserToChannel(socket);
      socketFunctions.setChannelMessageInDOM(io, socket.id, socket.channelName);
    }

    socketFunctions.createLog(io, logString, socket.channelName);
    socketFunctions.printAllArrays();
    socketFunctions.updateUsersInDOM(io);
    socketFunctions.setGroupMessagesInDOM(socket);
    socketFunctions.updateUserInChannelDOM(io, socket);
    socketFunctions.setChannelsInDOM(io, socket);

    socket.on('disconnect', function(){
      var logString = socket.username + ' Disconnected';
      socketFunctions.createLog(io, logString, socket.channelName);
      console.log(socket.username + 'disconnected');
      socketFunctions.userDisConnectFromChannel(socket);
      socketFunctions.userDisconnectUpdate(socket.username, socket);
      socketFunctions.updateUsersInDOM(io);
      socketFunctions.updateUserInChannelDOM(io, socket);
      socketFunctions.setChannelsInDOM(io, socket);
    });

    socket.on('new channel message', function(data, callback){
      var loggedUsers = socketFunctions.getUsersArray();
      if(loggedUsers.indexOf(socket.username) == -1){
        io.emit('User disconnected');
      }
      else{
        console.log(loggedUsers);
        var messageText = HTMLCutter(data.messageText);
        var result = checkForCommand.checkIfCommandORNot(messageText, socket, io);
        if(result == false){
          io.sockets.in(socket.channelName).emit('new channel message', {'sender' : socket.username, 'messageText' : messageText});
          socketFunctions.channelMessageHandler(socket, data);
        }
        else{
          console.log(result);
          callback(result);
        }
      }
    });

    socket.on('new group message', function(data, callback){
      var loggedUsers = socketFunctions.getUsersArray();
      if(loggedUsers.indexOf(socket.username) == -1){
        io.emit('User disconnected');
      }
      else{
        console.log('NEW GROUP MESSAGE');
        var messageText = data.messageText.trim();
        messageText = HTMLCutter(messageText);
        /* check for the command and executes the corresponding function */
        /* check for swish or join */
        var result = checkForCommand.checkIfCommandORNot(messageText, socket, io);
        if(result === false){
          io.emit('new group message', {'sender' : socket.username, 'messageText' : messageText});
          socketFunctions.groupMessageHandler(socket, data);
        }
        else{
          console.log(result);
          callback(result);
        }
      }
    });

    socket.on('new private message', function(data){
      var receiver = data.receiver,
          messageText = data.messageText,
          sender = socket.username;
      var receiverSocketIDArr = socketFunctions.getUserSocketIdArr(receiver);
      console.log(receiverSocketIDArr);
      if(receiverSocketIDArr != undefined && receiverSocketIDArr.length > 0){
        receiverSocketIDArr.forEach(function(socketid){
          io.sockets.connected[socketid].emit('new private message', {'messageText' : messageText, 'sender' : sender});
        });
      }
    });
  });

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
