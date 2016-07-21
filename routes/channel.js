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

/* check if the channel exists or not */

router.get('/:channel', function(req,res){
  var channel = req.params.channel;
  ChannelModel.find({'channelName' : channel}).exec(function(err, data){
    if(!data.length){
      res.render('chat/channel404', {'channelName': channel});
    }
    else{
      var channelDescription = data[0].channelDescription,
          channelOwner = data[0].channelOwner,
          channelName = data[0].channelName;
      res.render('chat/channel_view', {'channelName':channelName, 'channelDescription':channelDescription, 'channelOwner':channelOwner});
    }
  });
});

module.exports = router;
