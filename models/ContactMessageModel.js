/*
*  author : abhishek goswami(hiro)
*  abhishekg785@gmail.com
*/

var mongoose = require('mongoose');

var contactMessageSchema = new mongoose.Schema({
  username : String,
  message : String,
  email : String,
  date : {
    type : Date,
    default : Date.now
  }
});

var ContactMessageModel = mongoose.model('ContactMessageModel', contactMessageSchema);
module.exports = ContactMessageModel;
