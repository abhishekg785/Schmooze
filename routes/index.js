/*
*  author : abhishek goswami (hiro)
*  abhishekg785@gmail.com
*/

var express = require('express');
var router = express.Router();
var socketFunctions = require('../shared/socketFunctions');
var ContactMessageModel = require('../models/ContactMessageModel');
var HTMLCutter = require('../shared/HTMLCutter');

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
  res.render('index', {'message':''});
});

router.post('/login', check_login, function(req,res){
  var username = HTMLCutter(req.body.username);
  var spaceIndex = username.indexOf(' ');
  if(spaceIndex == -1){
    if(username.length > 3){
      var onlineUsers = socketFunctions.getUsersArray();
      var userIndex = onlineUsers.indexOf(username);
      if(userIndex == -1){
        req.session.username = username;
        res.redirect('/channel');
      }
      else{
        res.render('index', {'message':'Nickname is taken at the moment!  Try with another nickname'});
      }
    }
    else{
      res.render('index', {'message':'Nickname Field must have atleast 4 chars'});
    }
  }
  else {
    res.render('index', {'message' : 'Nickname cannot have spaces :)'});
  }
});

router.get('/logout/',function(req,res){
  res.redirect('/logoutEvent');
});

router.post('/contact/', function(req, res){
  var userData = req.body,
      username = HTMLCutter(userData.user),
      message = HTMLCutter(userData.message),
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

// autocompletion demo
router.get('/autocomplete', function(req, res){
  res.render('autocomplete');
});

module.exports = router;
