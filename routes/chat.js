var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
  var username = req.session.username;
  console.log(req.session.username);
  res.render('chat/main.html',{'username':username});
});

module.exports = router;
