/*
*  author: abhishek goswami (hiro)
*  abhishekg785@gmail.com
*
*  socketFunctions.js file
*  this file contains all the functions required in app.js for socket management
*/

var users = [],
    userSocketObject = {},
    userSocketIds = [];    /* array for storing users socketIDS */

var self = module.exports = {

  addNewUser : function(username){
    users.push(username);
    console.log(users);
  },

  addNewUserSocketObject : function(username, socket){
    userIndex = self.getUserIndex(username);
    userSocketIds[userIndex].push(socket.id);
    console.log(userSocketIds);
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
        console.log(users);
      }
      else if(userSocketIdsArr.length > 0){     /* this means that the socketiD can be removed form the userSocketIds */
        console.log('MORE THAN ONE TAB OPEN');
      }
      userSocketIdsArr.splice(socketIDIndex,1);
    }
  },

  updateUsersInDOM : function(io){
    io.emit('update users', {'users' : users});
  },

  getUsersArray : function(){
    return users;
  },

  getUserSocketIdArr : function(){
    return userSocketIds;
  }

}
