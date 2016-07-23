var express = require('express');
var router = express.Router();
var socketFunctions = require('../shared/socketFunctions');

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

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
