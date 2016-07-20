/*
* author: abhishek goswami
* abhishekg785@gmail.com
*
*  chat handler module
*/

var express = require('express');
var router = express.Router();

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
  res.render('chat/main.html',{'username':username});
});

module.exports = router;
