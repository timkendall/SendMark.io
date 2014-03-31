'use strict';

//Setting up route
angular.module('SendMark').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/login', {
            templateUrl: 'views/users/login.html',
            public: true,
            login: true
        }).
        when('/signup', {
            templateUrl: 'views/users/signup.html',
            public: true
        }).
        when('/settings', {
            templateUrl: 'views/users/settings.html'
        }).
        when('/inbox', {
            templateUrl: 'views/inbox.html'
        }).
        when('/lists/create', {
            templateUrl: 'views/lists/create.html'
        }).
        when('/lists/:listId/edit', {
            templateUrl: 'views/lists/edit.html'
        }).
        when('/lists/:listId', {
            templateUrl: 'views/lists/view.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('SendMark').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

// Initialize UserApp
angular.module('SendMark').run(function($rootScope, user) {
    user.init({ appId: '52e93bb22f2fa' });
});

// Refresh user's lists on every route change
angular.module('SendMark').run(function ($rootScope, $location, Global, Lists) {
   $rootScope.$watch(function () {
      return $location.path();
    },
    function (path) {
      if (!$rootScope.user.authorized) return;

      // Get Lists
      Lists.query(function (lists) {
        if (!lists) alert('Failed to load lists.');
        Global.lists = lists;
      });
    });
});