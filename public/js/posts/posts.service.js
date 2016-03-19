angular.module('posts').factory('PostsService', ['$http', 'AuthService',
	function($http, auth){
		var factory = {
			posts: []
		};

		factory.getAll = function() {
			return $http.get('/posts').success(function(data) {
				angular.copy(data, factory.posts);
			});
		};

		factory.create = function(post) {
			return $http.post('/posts', post).success(function(data) {
				factory.posts.push(data);
			});
		};

		factory.upvote = function(post) {
			return $http.put('/posts/' + post._id + '/upvote').success(function(data) {
				post.upvotes += 1;
			});
		};

		factory.get = function(id) {
			return $http.get('/posts/' + id).then(function(res) {
				return res.data;
			});
		};

		factory.delete = function(post) {
			return $http.delete('/posts/' + post._id).success(function(data) {
				angular.copy(data, factory.posts);
			});
		}

		factory.addComment = function(id, comment) {
			return $http.post('/posts/' + id + '/comments', comment);
		};

		factory.upvoteComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
				.success(function(data) {
					comment.upvotes += 1;
				});
		};

		factory.create = function(post) {
			return $http.post('/posts', post, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				factory.posts.push(data);
			});
		};

		factory.upvote = function(post) {
			return $http.put('/posts/' + post._id + '/upvote', null, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				post.upvotes += 1;
			});
		};

		factory.addComment = function(id, comment) {
			return $http.post('/posts/' + id + '/comments', comment, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			});
		};

		factory.upvoteComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				comment.upvotes += 1;
			});
		};

		return factory;
	}
])
