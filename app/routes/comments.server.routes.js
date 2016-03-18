var users = require('../controllers/users.server.controller'),
	comments = require('../controllers/comments.server.controller');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

module.exports = function(app) {
	app.route('/posts/:post/comments')
		.post(auth, comments.addComment);
	app.route('/posts/:post/comments/:comment/upvote')
		.put(auth, comments.upvoteComment);
	app.param('comment', comments.getCommentById);
};
