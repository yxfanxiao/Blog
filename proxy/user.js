var models = require('../models/db');
var User = models.User;

exports.newUserSave = function (name, password, callback) {
	var user  = new User();
	user.name= name;
	user.password = password;
	user.save(callback);
};

exports.getUserByName = function (name, callback) {
	User.findOne({ name: name }, callback);
};