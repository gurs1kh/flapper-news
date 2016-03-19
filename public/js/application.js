var app = angular.module('flapperNews', ['ui.router', 'auth', 'nav', 'posts', 'main']);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/views/home.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['PostsService', function(posts) {
						return posts.getAll();
					}]
				}
			})
			.state('posts', {
				url: '/posts/{id}',
				templateUrl: '/views/post.html',
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'PostsService', function($stateParams,posts) {
						return posts.get($stateParams.id);
					}]
				}
			})
			.state('login', {
				url: '/login',
				templateUrl: '/views/login.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'AuthService', function($state, auth){
					if(auth.isLoggedIn()){
						$state.go('home');
					}
				}]
			})
			.state('register', {
				url: '/register',
				templateUrl: '/views/register.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'AuthService', function($state, auth){
					if(auth.isLoggedIn()){
						$state.go('home');
					}
				}]
			});
		$urlRouterProvider.otherwise('home');
	}
]);
