require('./db')								// 单独测试时用
var Post = require('../proxy').Post;
var mongoose = require('mongoose')
var Schema = mongoose.Schema

Post.addComment('55d76e6a874cbd583e083113', '评论家', '这是我的第一条评论', function (err, model) {
	console.log('到这了');
	console.log(model);
});