var users = require('../controllers/users.server.controller'),
	posts = require('../controllers/posts.server.controller');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

module.exports = function(app) {
	app.route('/posts')
		.get(posts.getAllPosts)
		.post(auth, posts.addPost);
	app.route('/posts/:post')
		.get(posts.getPostComments)
		.delete(posts.deletePost);
	app.route('/posts/:post/upvote')
		.put(auth, posts.upvotePost);
	app.param('post', posts.postById);
};
