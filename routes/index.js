var express = require('express');
var router = express.Router();

/* middleware for checking user is logged in or not */

function check_login(req,res,next){
  if(req.session.username){
    res.redirect('/chat');
  }
  next();
}

router.get('/', check_login, function(req, res, next) {
  res.render('index');
});

router.post('/',function(req,res){
  var username = req.body.username;
  req.session.username = username;
  console.log('session set');
  console.log(req.session);
  res.redirect('/chat');
});

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
