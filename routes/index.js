var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../proxy').User;
var Post = require('../proxy').Post;
var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
	var user = req.session.user ? req.session.user.name : '游客';
	Post.getPostByUser(user, function (err, docs) {
		if (err) {
			posts = [];
		}
		var postDate = [];
		docs.forEach(function (post, index) {
			postDate[index] = moment(post.date).format('YYYY-MM-DD HH:mm:ss');			
		});
		console.log(docs);
		res.render('index', {
			title: '主页',
			user: req.session.user,
			posts: docs,
			postDate: postDate,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		 });
	});
});

router.get('/reg', function (req, res, next) {
 	res.render('reg', { 
 		title: '注册',
 		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
 	});
});
router.post('/reg', function (req, res, next) {
	var name = req.body.name,	
		password = req.body.password,
		password2 = req.body.password2;
	if (password2 !== password) {
		req.flash('error', '两次密码输入不一致');
		return res.redirect('/reg');
	}
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
	User.newUserSave(name, password, function () {
		req.flash('success', '注册成功！');
		res.redirect('/');
	});
});

router.get('/login', function (req, res, next) {
 	res.render('login', { 
 		title: '登录',
 		user: req.session.user,
 		success: req.flash('success').toString(),
 		error: req.flash('error').toString() 
 	});
});
router.post('/login', function (req, res, next) {
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
	User.getUserByName(req.body.name, function (err, user) {
		if (!user) {
			req.flash('error', '用户不存在！');
			return res.redirect('/login');
		}
		if(user.password != password) {
			req.flash('error', '密码错误！');
			console.log(user);
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', '登录成功！')
		res.redirect('/');
	});
});

router.get('/post', function (req, res, next) {
 	res.render('post', { 
 		title: '发表',
 		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
 	});
});
router.post('/post', function (req, res, next) {
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
});

router.get('/logout', function (req, res, next) {
 	req.session.user = null;
 	req.flash('success', '登出成功！');
 	res.redirect('./');
});

module.exports = router;
