/**
*  @author : abhishek goswami
*  abhishekg785@gmail.com
*
*  socketMiddleware.js : it will get the username from the session cookie and store it in redis store and thus we can use the things later in our app
*/


var cookieParser = require('cookie-parser');
var config = require('../../config');
var sessionService = require('../../shared/session-service');
var socketFunctions = require('../../shared/socketFunctions');

module.exports = function(io) {

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

}