var express = require('express');
var router = express.Router();
var socketFunctions = require('../shared/socketFunctions');
var ContactMessageModel = require('../models/ContactMessageModel');

/* middleware for checking user is logged in or not */

function check_login(req,res,next){
  if(req.session.username){
    res.redirect('/chat');
  }
  next();
}

router.get('/', check_login, function(req, res){
  res.render('startPage');
});

router.get('/login', check_login, function(req, res, next) {
  res.render('index', {'message':'loginPage'});
});

router.post('/login',function(req,res){
  var username = req.body.username;
  var onlineUsers = socketFunctions.getUsersArray();
  var userIndex = onlineUsers.indexOf(username);
  if(userIndex == -1){
    req.session.username = username;
    console.log('session set');
    console.log(req.session);
    res.redirect('/chat');
  }
  else{
    res.render('index', {'message':false});
  }
});

router.get('/logout/',function(req,res){
  res.redirect('/logoutEvent');
});

router.post('/contact/', function(req, res){
  var userData = req.body,
      username = userData.user,
      message = userData.message,
      email = userData.email;
  var newContact = new ContactMessageModel({
    username : username,
    message : message,
    email : email
  });
  newContact.save(function(err, data){
    if(!err){
      console.log(data);
      res.end('dcldckldnckldnc');
    }
    else{
      console.log(err);
      res.end('Error Occurred! Try Again');
    }
  });
});

module.exports = router;
