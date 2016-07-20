var users = [],
    userSocketObject = [];

var self = module.exports = {

  addNewUser : function(username){
    users.push(username);
    console.log(users);
  },

  addNewUserSocketObject : function(username, socket){
    userSocketObject[username] = socket;
  },

  getUserIndex : function(username){
    index = users.indexOf(username);
    if(index == -1){
      return -1;
    }
    return index;
  },

  /* update the users and userSocketObject array on user disconnect */
  userDisconnectUpdate : function(username, socket){
    userIndex = self.getUserIndex(username);
    console.log(userIndex);
    if(userIndex != -1){
      users.splice(username, 1);
      delete userSocketObject[username];
    }
  },

  getUsersArray : function(){
    return users;
  },

  getUserSocketObject : function(){
    return userSocketObject;
  }

}
