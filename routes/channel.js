var express = require('express');
var router = express.Router();
var ChannelModel = require('../models/channelSchema');

/*  find all the existing channels in the ChannelModel */
router.get('/', function(req,res){
  var channels = [];
  getChannels(function(data){
    channels = data;
    res.render('chat/channels',{'channels':channels});
  });
});

/* get channels from the model and once it gets the data it callbacks to render the page */
function getChannels(callback){
  var channelQuery = ChannelModel.distinct('channelName');
  channelQuery.exec(function(err, data){
    callback(data);
  });
}

router.post('/', function(req, res){
  var channelInfo = req.body,
      channelName = channelInfo.channelName,
      channelDesc = channelInfo.channelDesc;
  var newChannel = ChannelModel({
    'channelName' : channelName,
    'channelDescription' : channelDesc,
    'channelOwner' : req.session.username
  });
  newChannel.save();
  res.redirect('/channel');
});

/*
* middleware for checking that the user should be allowed to enter only in the
* channels that exists
*/

function checkChannel(req, res, next){
  ChannelModel.find({})
}
router.get('/:channel', function(req,res){
  var channel = req.params.channel;
  res.render('chat/channel_view', {'channelName':channel});
});

module.exports = router;
