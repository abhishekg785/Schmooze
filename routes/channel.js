var express = require('express');
var router = express.Router();
var ChannelModel = require('../models/channelSchema');

/*  find all the existing channels */
router.get('/', function(req,res){
  var channelQuery = ChannelModel.find({}),
      channels = [];
  channelQuery.exec(function(err, data){
    channels = data;
    console.log(channels);
  });
  console.log(channels);
  res.render('chat/channels');
});

/*
* middleware for checking that the user should be allowed to enter only in the
* channels that exists
*/
router.get('/:channel', function(req,res){
  var channel = req.params.channel;
  res.render('chat/channel_view', {'channelName':channel});
});

module.exports = router;
