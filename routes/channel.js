/*
*  author : abhishek goswami (hiro)
*  abhishekg785@gmail.com
*
*  channel.js file : handling channel views
*/

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
  ChannelModel.find({'channelName' : channelName}).exec(function(err, data){
    if(!err){
      if(!data.length){
        var newChannel = ChannelModel({
          'channelName' : channelName,
          'channelDescription' : channelDesc,
          'channelOwner' : req.session.username
        });
        newChannel.save();
        res.redirect('/channel');
      }
      else{
        res.render('chat/warning_page', {'message' : 'Channel Exists! Try again with a different Name'});
      }
    }
    else{
      res.end('Error occured! Try Again!');
    }
  });
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
      console.log('Getting channel' + channel);
      var channelDescription = data[0].channelDescription,
          channelOwner = data[0].channelOwner,
          channelName = data[0].channelName;
      res.render('chat/channel_view', {'username' : req.session.username,'channelName':channelName, 'channelDescription':channelDescription, 'channelOwner':channelOwner});
    }
  });
});


module.exports = router;
