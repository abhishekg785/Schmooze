/*
*  author: abhishek goswami
*  abhishekg785@gmail.com
*
*  GroupMessageModel.js
*  file is for creating a GroupMessageModel for storing the universal group messages
*/

var mongoose = require('mongoose');

var groupMessageSchema = new mongoose.Schema({
  username : String,
  messageText : String,
  date : {
    type : Date,
    default : Date.now
  }
});

var GroupMessageModel = mongoose.model('GroupMessageModel', groupMessageSchema)
module.exports = GroupMessageModel;
