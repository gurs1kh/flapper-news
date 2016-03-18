var Comment = require('mongoose').model('Comment');

exports.getCommentById = function (req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function (err, comment) {
		if (err) { return next(err); }
		if (!comment) { return next(new Error("can't find comment")); }

		req.comment = comment;
		return next();
	});
}

exports.upvoteComment = function (req, res, next) {
	req.comment.upvote(function (err, comment) {
		if (err) {
			return next(err);
		}

		res.json(comment);
	});
}

exports.addComment = function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.author = req.payload.username;

	comment.save(function(err, comment) {
		if (err) { return next(err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if (err) { return next(err); }

			res.json(comment);
		});
	});
}
