var models = require('../models/db');
var Post = models.Post;

exports.newPostSave = function (name, title, postContent, callback) {
	var post  = new Post();
	post.name= name;
	post.title = title;
	post.postContent = postContent;
	post.save(callback);
};

exports.getPostByUser = function (name, callback) {
	Post.find({ name: name }, callback);
};