/*
* author: abhishek goswami
* abhishekg785@gmail.com
*
*  chat.js : chat handler module
*/

var express = require('express');
var router = express.Router();
var SocketFunctions = require('../shared/socketFunctions');

//middleware to check if user is logged in or not
function check_login(req,res,next){
  console.log('in the check_login');
  if(!req.session.username){
    res.redirect('/');
  }
  next();
}

router.get('/',check_login,function(req,res){
  var username = req.session.username;
  console.log(req.session.username);
  SocketFunctions.getChannels(function(data){
    if(data){
      res.render('chat/main.html',{'username':username, 'channels':data});
    }
    else{
      res.end('error');
    }
  });
});

module.exports = router;
