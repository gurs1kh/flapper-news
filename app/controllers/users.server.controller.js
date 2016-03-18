var User = require('mongoose').model('User');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				message = err.errors[errName].message;
		}
	}

	return message;
};

exports.register = function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password)
	user.save(function (err){
		if(err){ return next(err); }

		return res.json({token: user.generateJWT()})
	});
}

exports.login = function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate('local', function(err, user, info){
		if(err){ return next(err); }

		if(user){
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
}

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.saveOAuthUserProfile = function(req, profile, done) {
	User.findOne({
			provider: profile.provider,
			providerId: profile.providerId
		},
		function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						profile.username = availableUsername;
						user = new User(profile);

						user.save(function(err) {
							if (err) {
								var message = _this.getErrorMessage(err);
								req.flash('error', message);
								return res.redirect('/register');
							}

							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		}
	);
};

exports.create = function(req, res, next) {
	var user = new User(req.body);
	user.save(function(err) {
		if (err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};

exports.list = function(req, res, next) {
	User.find({}, function(err, users) {
		if (err) {
			return next(err);
		} else {
			res.json(users);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
	User.findOne({
			_id: id
		},
		function(err, user) {
			if (err) {
				return next(err);
			} else {
				req.user = user;
				next();
			}
		}
	);
};

exports.update = function(req, res, next) {
	User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
		if (err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};

exports.delete = function(req, res, next) {
	req.user.remove(function(err) {
		if (err) {
			return next(err);
		} else {
			res.json(req.user);
		}
	})
};

exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}
	next();
};
