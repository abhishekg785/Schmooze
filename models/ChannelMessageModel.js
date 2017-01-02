/*
*  author: abhishek goswami
*  abhishekg785@gmail.com
*
*  ChannelMessageModel.js
*  file is for creating a ChannelMessageModel for storing the channel  messages
*/

var mongoose = require('mongoose');

var channelMessageSchema = new mongoose.Schema({
  username : String,
  messageText : String,
  channelName : String,
  date : {
    type : Date,
    default : Date.now
  }
});

var ChannelMessageModel = mongoose.model('ChannelMessageModel', channelMessageSchema);
module.exports = ChannelMessageModel;
