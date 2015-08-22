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

exports.getPostById = function (id, callback) {
	Post.findById({ _id: id }, callback);
};

exports.update = function (id, title, postContent,callback) {
	Post.update({ _id: id }, {
		$set: {
			title: title,
			postContent: postContent
		}
	}, callback);
};

exports.removeById = function (id, callback) {
	Post.remove({ _id: id }, callback);
};


exports.addComment = function (id, name, comment, callback) {
	Post.findByIdAndUpdate(
		id,
		{ $push: { comments: { name: name, comment: comment }}},
		{safe: true, upsert: true},
		callback
		);
};