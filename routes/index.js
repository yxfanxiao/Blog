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

router.get('/u/:name', post.userPost);
router.get('/u/:name/:article', post.userArticle);

router.get('/tags', post.tags);

router.get('/tags/:tag', post.postByTag);

router.get('/search', post.search);

router.post('/u/:name/:article', post.article);

router.get('/edit/:article', post.editArticle);

router.post('/edit/:article', post.submitEditArticle);

router.get('/remove/:name/:article', post.removeArticle);

module.exports = router;
