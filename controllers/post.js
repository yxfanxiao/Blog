var Post = require('../proxy').Post;
var crypto = require('crypto');
var User = require('../proxy').User;
var moment = require('moment');
var markdown = require('markdown').markdown;
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

exports.userPost = function (req, res, next) {
	var page = req.query.p ? parseInt(req.query.p) : 1;
	User.getUserByName(req.params.name, function (err, user) {
		// console.dir(user);
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.get2Post(user.name, page, function (err, docs) {
			if (err) {
				req.flash('error', err)
				return res.redirect('/');
			}
			var postDate = [];
			docs.forEach(function (post, index) {
				postDate[index] = moment(post.date).format('YYYY-MM-DD HH:mm:ss');	
				post.postContent = markdown.toHTML(post.postContent);		
			});
			Post.getPostCount(user.name, function (err,count) {
				res.render('user', {
					title: user.name,
					posts: docs,
					page: page,
					isFirstPage: (page - 1) == 0,
					isLastPage: (page - 1) * 2 + docs.length == count,			
					user: req.session.user,
					postDate: postDate,
					success: req.flash('success').toString(),
					error: req.flash('error').toString() 
				});
			});
			
		});
	});
};

exports.userArticle = function (req, res, next) {
	// console.log(req.params.article);
	Post.getPostById(req.params.article, function (err, post) {
		if (!post) {
			req.flash('error', '文章不存在');
			return res.redirect('/');
		}
		Post.incPV(req.params.article, function (err) {
			if (err) {
				req.flash('error', '增加阅读统计出现错误 (  -.-)');
				return res.redirect('/');
			}
			post.comments.forEach(function (comment) {
				comment.comment = markdown.toHTML(comment.comment);
			});
			var postDate = moment(post.date).format('YYYY-MM-DD HH:mm:ss');
			res.render('article', {
				title: post.title,
				_id: req.params.article,
				name: post.name,
				post: post,
				postDate: postDate,
				postContent: markdown.toHTML(post.postContent),
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				user: req.session.user,
				comments: post.comments			
			});			
		});
	});
};

exports.tags = function (req, res, next) {
  Post.getTags(function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('tags', {
      title: '标签',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
};

exports.postByTag = function (req, res, next) {
	Post.getPostByTag(req.params.tag, function (err, posts) {
		if (err) {
  			req.flash('error',err); 
  			return res.redirect('/');
  		}
  		console.log('tag:' + posts);
  		var postDate = [];
  		posts.forEach(function (post, index) {
  			postDate[index] = moment(post.date).format('YYYY-MM-DD HH:mm:ss');
  		})
  		res.render('tag', {
  		 	title: 'TAG:' + req.params.tag,
  		 	posts: posts,
  		 	postDate: postDate,
  		 	user: req.session.user,
  		 	success: req.flash('success').toString(),
  		 	error: req.flash('error').toString()
  		});

	});
};

exports.search = function (req, res, next) {
  	Post.findPostByTitle(req.query.keyword, function (err, posts) {
    	if (err) {
       	  req.flash('error', err); 
      	  return res.redirect('/');
    	}
    	var postDate = [];
  		posts.forEach(function (post, index) {
  			postDate[index] = moment(post.date).format('YYYY-MM-DD HH:mm:ss');
  		})
    	res.render('search', {
    	  title: "SEARCH:" + req.query.keyword,
    	  posts: posts,
    	  postDate: postDate,
    	  user: req.session.user,
    	  success: req.flash('success').toString(),
    	  error: req.flash('error').toString()
    	});
  });
};

exports.article = function (req, res, next) {
	Post.addComment(req.params.article, req.body.name, req.body.content, function (err) {
		if (err) {
			req.flash('err', err);
			return res.redirect('/');
		}
		req.flash('success', '评论提交成功！');
		res.redirect('back');
	});
};

exports.editArticle = function (req, res, next) {
	var user = req.session.user;
	var post_id = req.params.article;
	Post.getPostById(post_id, function (err, post) {
		// console.log(post);
		if (!post) {
			req.flash('error', '文章不存在');
			return res.redirect('/');
		}
		// console.log('post');
		var postDate = moment(post.date).format('YYYY-MM-DD HH:mm:ss');
		res.render('edit', {
			title: post.title,
			_id: post_id,
			name: post.name,
			post: post,
			postDate: postDate,
			postContent: post.postContent,
			success: req.flash('success').toString(),
			error: req.flash('error').toString(),
			user: req.session.user			
		});
	});
};

exports.submitEditArticle = function (req, res, next) {
	var user = req.session.user;
	var post_id = req.params.article;
	var url = '/edit/' + post_id;
	Post.update(post_id, req.body.title, req.body.postContent, function (err, post) {
		if (err) {
			req.flash('err', err);
			return res.redirect(url);
		}
		req.flash('success', '修改成功！');
		res.redirect(url);
	});
};

exports.removeArticle = function (req, res, next) {
	var user = req.session.user;
	if (user.name !== req.params.name) {
		req.flash('err', '请勿删除他人的文章！');
		return res.redirect('back');
	}
	var post_id = req.params.article;
	Post.removeById(post_id, function (err) {
		if (err) {
			req.flash('err', '删除失败！');
			return res.redirect('/');
		}
		req.flash('success', '删除成功！');
		res.redirect('/');
	});	
};