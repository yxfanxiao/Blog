var mongoose = require('mongoose')
var settings = require('../settings');

mongoose.connect(settings.mongodb_url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('成功连上数据库！');
});

require('./user');
require('./post');

exports.User = mongoose.model('User');
exports.Post = mongoose.model('Post');