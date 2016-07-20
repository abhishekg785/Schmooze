var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
  res.render('chat/channels');
});

router.get('/:channel', function(req,res){
  var channel = req.params.channel;
  res.render('chat/channel_view', {'channelName':channel});
});

module.exports = router;
