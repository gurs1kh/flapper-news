var users = require('../controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/users')
		.post(users.create)
		.get(users.list);

	app.route('/users/:userId')
		.get(users.read)
		.put(users.update)
		.delete(users.delete);

	app.param('userId', users.userByID);
	app.route('/register')
		.post(users.register);

	app.route('/login')
		.post(users.login);

	app.get('/logout', users.logout);
};
