var models = require('../models/db');
var Post = models.Post;

exports.newPostSave = function (name, title, tags, postContent, callback) {
	var post  = new Post();
	post.name= name;
	post.title = title;
	post.tags = tags;
	post.postContent = postContent;
	post.save(callback);
};

exports.getPostByUser = function (name, callback) {
	Post.find({ name: name }, callback);
};

// 每页2篇，仅为试一下分页
exports.get2Post = function (name, page, callback) {
	Post
	  .count({ name: name }, function (err, num) {
	  	console.log(num)
		Post
	       .find({ name: name })
	       .sort('-date')
	       .skip((page - 1) * 2)
	       .limit(2)
	       .exec(callback);  	
	  });
};

exports.getPostCount = function (name, callback) {
	Post.count({ name: name }, callback);
}

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
		{ safe: true, upsert: true },
		callback
		);
};

exports.getTags = function (callback) {
	Post.distinct('tags', callback);
};

exports.getPostByTag = function (tag, callback) {
	Post.find({ tags: tag }, 'name _id title date', { sort: '-date' }, callback);
};