var express = require('express');
var router = express.Router();
// var crypto = require('crypto');
// var User = require('../proxy').User;
// var Post = require('../proxy').Post;
// var moment = require('moment');
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

module.exports = router;
