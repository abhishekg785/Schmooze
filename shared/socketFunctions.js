/*
*  author: abhishek goswami (hiro)
*  abhishekg785@gmail.com
*
*  socketFunctions.js file
*  this file contains all the functions required in app.js for socket management
*/

var users = [],
    userSocketIds = [],   /* array for storing users socketIDS */
    channels = [],        /* array containing channels */
    channelUsers = [],    /* array containing channel users */
    channelUserSocketIDs = []; /* array containing socketid of users for multiple tab */

var self = module.exports = {

  addNewUser : function(username){
    users.push(username);
  },

  addNewUserSocketObject : function(username, socket){
    userIndex = self.getUserIndex(username);
    userSocketIds[userIndex].push(socket.id);
  },

  getUserIndex : function(username){
    var index = users.indexOf(username);
    if(index == -1){
      return -1;
    }
    return index;
  },

  initializeUserSocketIds : function(username){
    userSocketIds.push([]);
  },

  /* update the users and userSocketObject array on user disconnect
  *  remove the socket id of the user from the socketIDS array
  *  if the socketIDS array becomes 0 for a username then remove the username from the users array
   */
  userDisconnectUpdate : function(username, socket){
    var userIndex = self.getUserIndex(username);
    if(userIndex != -1){
      var userSocketIdsArr = userSocketIds[userIndex],
          socketIDIndex = userSocketIdsArr.indexOf(socket.id);
      if(userSocketIdsArr.length == 1){
        console.log('ONLY ONE TAB OPEN');
        users.splice(userIndex, 1);
        userSocketIds.splice(userIndex,1);
        // socket.leave(socket.channelName);
      }
      else if(userSocketIdsArr.length > 0){     /* this means that the socketiD can be removed form the userSocketIds */
        console.log('MORE THAN ONE TAB OPEN');
      }
      userSocketIdsArr.splice(socketIDIndex,1);
    }
  },

  getChannelIndex : function(channelName){
    var channelIndex = channels.indexOf(channelName);
    return channelIndex;
  },

  addNewChannel : function(channelName){
    channels.push(channelName);
  },

  addUserToChannel : function(socket){
    var channelName = socket.channelName,
        username = socket.username,
        channelIndex = self.getChannelIndex(channelName);
    channelUserSocketIDs[channelIndex].push(socket.id);
    /* check that user should not exists more than once in the channelUsers array due to more than one tab */
    var channelUsersArr = channelUsers[channelIndex];
    if(channelUsersArr.indexOf(username) == -1){
      channelUsers[channelIndex].push(username);
    }
    self.printAllArrays();
  },

  initializeChannelUsersArray : function(){
    console.log('INITIZLING CHANNLE USERS ARRAY');
    channelUsers.push([]);
    channelUserSocketIDs.push([]);
  },

  /*
  *  maintain three arrays => channels: for having channel names
  *  channelUsers : for having users in each channel
  *  channelUserSocketIDs : for having user socketids for each channel
  *  and dealing with multiple tabs problem
  *  so when a user disconnects from a particular channel ,then check for user socket id
  *  in channelUserSocketIDs for that channel, it it exists that means there is still a connection
  *  b/w user and that channel so do not remove the user from channelUser unless
  *  there is no socket id related to that user in the channelUserSocketIDs
  */

  userDisConnectFromChannel : function(socket){
    var channelName = socket.channelName,
        username = socket.username,
        socketID = socket.id;
    /* remove user from channelUserSocketIDs */
    var socketidIndex = channelUserSocketIDs.indexOf(socketID);
    var channelIndex = self.getChannelIndex(channelName);
    var userIndex = self.getUserIndex(username);
    var channelUserSocketIdArr = channelUserSocketIDs[channelIndex];
    if(channelUserSocketIdArr != undefined){
      if(channelUserSocketIDs[channelIndex].length > 0){
        channelUserSocketIDs[channelIndex].splice(socketidIndex, 1);
        var userSocketIdsArr = userSocketIds[userIndex];
        if(userSocketIdsArr == undefined || channelUserSocketIdArr == undefined){ /* means all socket connections closed */
          userSocketIdsArr = [];
        }
        var result = self.compareArray(channelUserSocketIdArr, userSocketIdsArr);
        console.log('RESULT OF K IS' + result);
        if(result == 0){  /* no socket connection exists b/w user and server */
          channelUsers[channelIndex].splice(userIndex, 1);
          // socket.leave(channelName);
        }
      }
    }
    self.printAllArrays();
  },

  /*get the channel users */
  updateUserInChannelDOM : function(io, socket){
    var channelIndex = self.getChannelIndex(socket.channelName),
        usersInChannel = channelUsers[channelIndex];
    io.sockets.in(socket.channelName).emit('channel user update', {'users':usersInChannel});
  },

  /*
  *  just checks if there is something common b/w arrays if yes then return true otherwise false
  *  array1 => socketIds of a user in the particuar channel
  *  array2 => overall socket ids of the user of all the connections
  *  len(array1) <  len(array2)
  */
  compareArray : function(array1, array2){
    var k = 0 ;
    console.log('IN THE CHECK FUNCTION');
    console.log('ARRAY1');
    console.log(array1);
    console.log('ARRAY2');
    console.log(array2);
    for(var i = 0 ; i < array1.length; i++){
      for(var j = 0 ; j <array2.length; j++){
        if(array1[i] == array2[j]){
          k++;
        }
      }
    }
    return k;
  },

  updateUsersInDOM : function(io){
    io.emit('update users', {'users' : users});
  },

  getUsersArray : function(){
    return users;
  },

  getUserSocketIdArr : function(){
    return userSocketIds;
  },

  getChannels : function(){
    return channels;
  },

  getChannelUsers : function(){
    return channelUsers;
  },

  getChannelUserSocketIdArr : function(){
    return channelUserSocketIDs;
  },

  printAllArrays : function(){
    console.log('ACTUAL VALUES OF ARRAY');
    console.log(userSocketIds);
    console.log(channels);
    console.log(channelUsers);
    console.log(channelUserSocketIDs);
  }

}
