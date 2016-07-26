var express = require('express');
var router = express.Router();
var socketFunctions = require('../shared/socketFunctions');

module.exports = function(io){
  return {
    index : router.get('/', function(req, res){
      var username = '';
      console.log('IN THE LOGOUT EVENT');
      if(req.session.username){
        username = req.session.username;
        req.session.destroy()
        socketFunctions.onLogoutEvent(username, io);;
        res.redirect('/');
      }
      else{
        res.redirect('/');
      }
    })
  }
}
