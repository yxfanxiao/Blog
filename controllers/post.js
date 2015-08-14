var Post = require('../proxy').Post;

exports.showPost = function (req, res, next) {
 	res.render('post', { 
 		title: '发表',
 		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
 	});
}

exports.post = function (req, res, next) {
	var currentUser = req.session.user,
		title = req.body.title,
		postContent = req.body.post;
	Post.newPostSave(currentUser.name, title, postContent, function (err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发布成功！');
		res.redirect('/');
	});
}