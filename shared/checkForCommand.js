/*
*  author : abhishek goswami(hiro)
*  abhishekg785@gmail.com
*
*  checkForCommand.js
*/

/*
*  /swish : for sending private messages
*  /join : for joining a channel
*/
var socketFunctions = require('./socketFunctions');
var commands = {
  private_messaging : {
    'symbol' : '/swish',
  },

  join_channel : {
    'symbol' : '/join',
  }
};

var channels = [];

var statusMessage = {
  invalid_command : 'The command you have entered is Invalid',
  message_success : 'Your message has been delivered successfully',
  no_user : 'No such user is exists at the moment',
  channel_err : 'Error in fecthing channels : Try Again :)',
  channel_not_found : 'No such channel Exists',
  command_err : 'No such command exists',
  message_len_err : 'Provide Message'
}

module.exports = commandFunctions = {
  checkIfCommandORNot : function(messageText, socket, io){
    messageText = messageText.trim();
    if(messageText.indexOf('/') != -1 && messageText.indexOf('/') == 0){                    /* command starts with / */
      /* check for private messaging */
      if(messageText.substr(0, commands.private_messaging.symbol.length) == commands.private_messaging.symbol){
        /*
        *  its a private message command
        *  fetch the message after the command symbol
        */
        var commandInfo = messageText.substr(commands.private_messaging.symbol.length);
        commandInfo = commandInfo.trim();
        var firstSpaceIndex = commandInfo.indexOf(' ');
        if(firstSpaceIndex == -1){
          return statusMessage['invalid_command'];
        }
        else{
          var receiver = commandInfo.substr(0, firstSpaceIndex),
              messageText = commandInfo.substr(firstSpaceIndex).trim(),
              sender = socket.username;
          if(messageText.length <= 0){
            return statusMessage['message_len_err'];
          }
          /*
          *  check if user exists
          *  if exists: send message to all the available socket ids of the user
          */
          var receiverIndex = socketFunctions.getUserIndex(receiver);
          if(receiverIndex != -1){
            var receiverSocketIDArr = socketFunctions.getUserSocketIdArr(receiver);
            if(receiverSocketIDArr != undefined){
              console.log('EMITTING MESSAGES');
              receiverSocketIDArr.forEach(function(socketid){
                io.sockets.connected[socketid].emit('new private message', {'messageText' : messageText, 'sender' : sender});
              });
            }
            return statusMessage['message_success'];
          }
          else{
            return statusMessage['no_user'];
          }
        }
      }
      else if(messageText.substr(0, commands.join_channel.symbol.length) == commands.join_channel.symbol){
        /*
        *   check for join channel
        *   check if the channel exists or not
        */
        var channelName = messageText.substr(commands.join_channel.symbol.length).trim();
        console.log(channelName);
        var dataArr = [];
        socketFunctions.channelExistsOrNot(channelName, function(data){
          if(data && data.length > 0){
            console.log(socket.channelName);
            var currentChannelName = socket.channelName;
            if(currentChannelName == undefined){                                 /* user is in globalChat */
              console.log(data);
              socket.emit('join channel command', {'channelName' : data[0].channelName});
            }
            else{
              /*
              *  user is in channel
              *  emit in the user's current channel to the current user
              */
              io.sockets.connected[socket.id].emit('join channel command', {'channelName' : data[0].channelName});
            }
          }
          else{
            channelName == undefined ?   socket.emit('join channel command', {'channelName' : false}) : io.sockets.connected[socket.id].emit('join channel command', {'channelName' : false});
          }
        });
      }
      else{
        return statusMessage['command_err'];
      }
    }
    else{
      return false;
    }
  }
}
