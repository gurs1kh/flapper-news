var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

exports.getAllPosts = function(req, res, next) {
	Post.find(function(err, posts) {
		if (err) { return next(err); }

		res.json(posts);
	});
};

exports.addPost = function(req, res, next) {
	var post = new Post(req.body);
	post.author = req.payload.username;

	post.save(function(err, post) {
		if(err) { return next(err); }

		res.json(post);
	});
}

exports.postById = function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function (err, post) {
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find post")); }

		req.post = post;
		return next();
	});
}

exports.getPostComments = function(req, res) {
	req.post.populate('comments', function (err, post) {
		res.json(post);
	});
}

exports.deletePost = function(req, res) {
	req.post.comments.forEach(function(id) {
		Comment.remove({
			_id: id
		}, function(err) {
			if (err) { return next(err)}
		});
	})
	Post.remove({
		_id: req.params.post
	}, function(err, post) {
		if (err) { return next(err); }

		// get and return all the posts after you delete one
		Post.find(function(err, posts) {
			if (err) { return next(err); }

			res.json(posts);
		});
	});
}

exports.upvotePost = function(req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) { return next(err); }

		res.json(post);
	});
}
