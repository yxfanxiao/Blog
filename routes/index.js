var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../proxy').User;
var Post = require('../proxy').Post;
var moment = require('moment');
var markdown = require('markdown').markdown;
var	sign = require('../controllers/sign');
var post = require('../controllers/post');

/* GET home page. */
router.get('/', sign.index);

router.get('/reg', sign.showReg);
router.post('/reg', sign.reg);

router.get('/login', sign.showLogin);
router.post('/login', sign.login);

router.get('/post', post.showPost);
router.post('/post', post.post);
router.get('/logout', sign.logout);

router.get('/upload', post.showPostPic);
router.post('/upload', post.postPic);

router.get('/u/:name', function (req, res, next) {
	User.getUserByName(req.params.name, function (err, user) {
		// console.dir(user);
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.getPostByUser(user.name, function (err, docs) {
			if (err) {
				req.flash('error', err)
				return res.redirect('/');
			}
			var postDate = [];
			docs.forEach(function (post, index) {
				postDate[index] = moment(post.date).format('YYYY-MM-DD HH:mm:ss');	
				post.postContent = markdown.toHTML(post.postContent);		
			});
			// console.log(docs);
			res.render('user', {
				title: user.name,
				posts: docs,
				user: req.session.user,
				postDate: postDate,
				success: req.flash('success').toString(),
				error: req.flash('error').toString() 
			});
		});
	});
});
router.get('/u/:name/:article', function (req, res, next) {
	// console.log(req.params.article);
	Post.getPostById(req.params.article, function (err, post) {
		// console.log(post);
		if (!post) {
			req.flash('error', '文章不存在');
			return res.redirect('/');
		}
		console.log('post');
		var postDate = moment(post.date).format('YYYY-MM-DD HH:mm:ss');
		res.render('article', {
			title: post.title,
			name: post.name,
			postDate: postDate,
			postContent: markdown.toHTML(post.postContent),
			success: req.flash('success').toString(),
			error: req.flash('error').toString(),
			user: req.session.user			
		});
	});
});

module.exports = router;
