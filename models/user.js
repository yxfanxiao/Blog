var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String },
	password: { type: String },
	create_at: { type: Date, default: Date.now }
});

exports.User = mongoose.model('User', UserSchema);					// 生成表为users

