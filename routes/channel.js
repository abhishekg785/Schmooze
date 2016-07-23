var express = require('express');
var router = express.Router();
var ChannelModel = require('../models/channelSchema');

/* middleware for checking if a user is logged in or not */
function checkLogin(req, res, next){
  if(req.session && req.session.username){
    next();
  }
  else{
    res.redirect('/login');
  }
};

/*  find all the existing channels in the ChannelModel */
router.get('/', checkLogin, function(req,res){
  var channels = [];
  getChannels(function(data){
    channels = data;
    res.render('chat/channels',{'channels':channels, 'username': req.session.username});
  });
});

function getChannels(callback){
  var channelQuery = ChannelModel.find({});
  channelQuery.exec(function(err, data){
    callback(data);
  });
}

router.post('/', checkLogin, function(req, res){
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
router.get('/:channel', checkLogin, function(req,res){
  var channel = req.params.channel;
  console.log(channel);
  ChannelModel.find({'channelName' : channel}).exec(function(err, data){
    if(!data.length){
      res.render('chat/channel404', {'channelName': channel});
    }
    else{
      var channelDescription = data[0].channelDescription,
          channelOwner = data[0].channelOwner,
          channelName = data[0].channelName;
      res.render('chat/channel_view', {'username' : req.session.username,'channelName':channelName, 'channelDescription':channelDescription, 'channelOwner':channelOwner});
    }
  });
});

router.get('/:channel')
module.exports = router;
