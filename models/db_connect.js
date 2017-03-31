/**
* @author : abhishek goswami  ( hiro )
* abhishekg785@gmail.com
*
* db_connect.js : file for connecting to the mongo db
*/

var mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb://localhost/schmooze', function(err){

	if(!err) {
		console.log('connected to db');
	}
	else{
		console.log('error' + err);
	}

});
