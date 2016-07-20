var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/',function(req,res){
  var username = req.body.username;
  req.session.username = username;
  console.log('session set');
  console.log(req.session);
  res.redirect('/chat');
});
module.exports = router;
