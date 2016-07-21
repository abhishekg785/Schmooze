/*
*  author: abhishek goswami
*  abhishekg785@gmail.com
*
*  channelSchema.js
*  file for creating a channel model for storing channels info
*/

var mongoose = require('mongoose');

var channelSchema = new mongoose.Schema({
  channelName : String,
  channelDescription : String,
  channelOwner : String
});

var ChannelModel = mongoose.model('ChannelModel', channelSchema)
module.exports = ChannelModel;
