var Post = require('../proxy').Post;
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage }).single('pic');


exports.showPost = function (req, res, next) {
 	res.render('post', { 
 		title: '发表',
 		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
 	});
};

exports.post = function (req, res, next) {
	var currentUser = req.session.user,
		title = req.body.title,
		tags = [req.body.tag1, req.body.tag2, req.body.tag3],
		postContent = req.body.post;
	Post.newPostSave(currentUser.name, title, tags, postContent, function (err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发布成功！');
		res.redirect('/');
	});
};

exports.showPostPic = function (req, res, next) {
	res.render('upload', {
		title: '文件上传',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
};

exports.postPic = function (req, res, next) {
	upload(req, res, function (err) {
		console.log(req.file);
		req.flash('success', '文件上传成功！');
		res.redirect('/upload');
	});
};
