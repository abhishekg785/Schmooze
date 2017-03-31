var socketFunctions = require('./shared/socketFunctions');
var HTMLCutter = require('./shared/HTMLCutter');
var checkForCommand = require('./shared/checkForCommand');

module.exports = function(io) {

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

    // here callback is a bidirectional callback b/w a server and a client 
    // possible since the client and server are having a bi directional connection using socket.io
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

}