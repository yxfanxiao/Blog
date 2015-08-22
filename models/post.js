var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
// var Date = new Date();
// var time = {
//       date: date,
//       year : date.getFullYear(),
//       month : date.getFullYear() + "-" + (date.getMonth() + 1),
//       day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
//       minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
//       date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
//   }


var PostSchema = new Schema({
	name: { type: String },
	title: { type: String },
	postContent: { type: String },
	date: { type: Date, default: Date.now },
	comments: [{
		name: { type: String },
		date: { type: Date, default: Date.now },
		comment: { type: String }
	}]
});

exports.Post = mongoose.model('Post', PostSchema);					

